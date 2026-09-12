import { createContext, useState, useContext, useEffect } from "react";
import { getGenres } from "../services/api";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [genres, setGenres] = useState([]);

    useEffect(() => { // load fav movies 
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) {
            setFavorites(JSON.parse(storedFavs));
        }
    }, []);

    useEffect(() => { // save fav movies
        localStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    useEffect(() => { // load movie genres
        const loadGenres = async () => { try { 
            const genreData = await getGenres(); 
            setGenres(genreData); 
        } catch (error) { 
            console.log("Failed to load genres:", error);
        } }; loadGenres();
    }, []);

    const addToFavorites = (movie) => {
        setFavorites((prev) => [...prev, movie]);
    };

    const removeFromFavorites = (movieId) => {
        setFavorites((prev) =>
            prev.filter((movie) => movie.id !== movieId)
        );
    };

    const isFavorite = (movieId) => {
        return favorites.some((movie) => movie.id === movieId);
    };

    const value = {
        favorites,
        genres,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
    };

    return (
        <MovieContext.Provider value={value}>
            {children}
        </MovieContext.Provider>
    );
};