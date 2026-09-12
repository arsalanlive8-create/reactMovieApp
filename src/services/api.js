const API_KEY = "a40e10686be49c3fa8a506835dc76503"
const BASE_URL = "https://api.themoviedb.org/3"
import '@vitejs/plugin-react/preamble'

export const getPopularMovies = async (page = 1) => {
    const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );
    const data = await response.json();
    return data;
};

export const searchMovies = async (query, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return data;
};

export const getGenres = async () => {
    const response = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.genres;
}

export const getMoviesByGenre = async (genreId, page = 1) => {
    const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
    );
    const data = await response.json();
    return data;
};

export const getMovieDetails = async (movieId) => {
    const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,release_dates`
    );
    if (!response.ok) {
        throw new Error("Failed to fetch movie details");
    }
    const data = await response.json();
    return data;
};