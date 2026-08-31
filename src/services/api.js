const API_KEY = "a40e10686be49c3fa8a506835dc76503"
const BASE_URL = "https://api.themoviedb.org/3"
import '@vitejs/plugin-react/preamble'

export const getPopularMovies = async () => {
    const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`) // adds to url with authenticated key
    const data = await response.json()
    return data.results                                                         // returns all movie data
}

export const searchMovies = async (query) => {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
    )}`)                                                                      // takes query and searches for that
    const data = await response.json()
    return data.results
}

export const getGenres = async () => {
    const response = await fetch(
        `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );

    const data = await response.json();
    return data.genres;
}

export const getMoviesByGenre = async (genreId) => {
    const response = await fetch(
        `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
    );

    const data = await response.json();
    return data.results;
}