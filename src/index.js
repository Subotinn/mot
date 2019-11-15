import "babel-polyfill";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import styles from './index.css';

const API_URL = 'http://www.splashbase.co/api/v1/images/search?query=';
const QUERY = 'cars';

const AppContainer = () => {
    const [{ images, isLoading, isError }, searchQuery, setSearchQuery, setSearchUrl] = useFetchImages(QUERY, API_URL);

    return (
        <>
            <SearchForm setSearchUrl={setSearchUrl}
                setQuery={setSearchQuery}
                query={searchQuery}
            />

            {isLoading ? <div>Loading images...</div> : (
                <SearchResult images={images} isError={isError} query={searchQuery} />
            )}
        </>
    );
};

// Create custom hook for requesting api data
const useFetchImages = (query, url) => {
    const [images, setImages] = useState([]);
    const [searchQuery, setSearchQuery] = useState(query);
    const [searchUrl, setSearchUrl] = useState(url + query);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchImages() {
            setIsLoading(true);

            setIsError(false);

            try {
                const fetchRequest = await fetch(searchUrl);

                const requestData = await fetchRequest.json();
                setImages(requestData.images);
            } catch (error) {
                setIsError(true);
            }

            setIsLoading(false);
        }

        fetchImages();
    }, [searchUrl]);

    return [{ images, isLoading, isError }, searchQuery, setSearchQuery, setSearchUrl];
};

const SearchForm = ({ setSearchUrl, query, setQuery }) => {
    return (
        <form onSubmit={event => {
            setSearchUrl(`${API_URL}${query}`);
            event.preventDefault();
        }}>
            <input type="text"
                value={query}
                onChange={event => setQuery(event.target.value)}
            />
            <button type="submit">Search new images</button>
        </form>
    );
};

const SearchResult = ({ images, isError }) => (
    <>
        <h2>Count of images: {images.length}</h2>

        {isError && <div className="error">Error</div>}

        <ImagesGrid images={images} />
    </>
);

const ImagesGrid = ({ images }) => (
    <div className="grid">
        {images.map((item) => <ImageCard carData={item} key={item.id} />)}
    </div>
);

const ImageCard = ({ carData }) => (
    <ImageComponent src={carData.url} alt={carData.site} />
);

const ImageComponent = ({ src, alt }) => (
    <img src={src} alt={alt} />
);

ReactDOM.render(<AppContainer />, document.getElementById("root"));