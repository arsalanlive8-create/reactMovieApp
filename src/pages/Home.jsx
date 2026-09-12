import MovieCard from "../components/MovieCard"
import {useState, useEffect} from "react"
import "../css/Home.css"
import { searchMovies, getPopularMovies, getGenres, getMoviesByGenre } from "../services/api";
import GenreFilter from "../components/GenreFilter";

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState([]) // runs only the first time so its not constantly fetching all movies
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(()=>{
        const loadPopularMovies = async () => {
            try{
                const popularMovies = await getPopularMovies(1)
                setMovies(popularMovies.results)
                setTotalPages(popularMovies.total_pages)
            } catch (err) {
                console.log(err)
                setError("failed to load movies")
            }
            finally {
                setLoading(false)
            }
        }
        const loadGenres = async () => {
            const genreList = await getGenres();
            setGenres(genreList);
        };

        loadGenres();
        loadPopularMovies()
    },[]) // checks if dependency array [] is changed each render of this code, if changed itll run the effect ()=>{}

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return
        if (loading) return             // check if loading, return

        setLoading(true)
        try{
            const searchResults = await searchMovies(searchQuery, 1)
            setMovies(searchResults.results)
            setTotalPages(searchResults.total_pages)
            setPage(1)

            setError(null)
        } catch (err){
            console.log(err)
            setError("failed to search movies...")
        } finally{
            setLoading(false)// whether fail or success we want to stop laoading
        } 
    }
    const handleGenreChange = async (e) => {
        const genreId = e.target.value;
        setSelectedGenre(genreId);
        setPage(1);
        try {
            if (genreId === "") {
                const movies = await getPopularMovies(1);
                setMovies(movies.results);
                setTotalPages(movies.total_pages);
            } else {
                const movies = await getMoviesByGenre(genreId, 1);
                setMovies(movies.results);
                setTotalPages(movies.total_pages);
            }
        } catch (err) {
            console.log(err);
            setError("Failed to load movies");
        }
    }
    const changePage = async (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setLoading(true);
    setPage(newPage);
    try {
        let data;
        if (searchQuery.trim()) {
            data = await searchMovies(searchQuery, newPage);
        } else if (selectedGenre) {
            data = await getMoviesByGenre(selectedGenre, newPage);
        } else {
            data = await getPopularMovies(newPage);
        }
        setMovies(data.results);
        setTotalPages(data.total_pages);
        } catch (err) {
            console.log(err);
            setError("Failed to load movies");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="home">
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text" 
                    placeholder="Search for movies..." 
                    className="search-input" 
                    value={searchQuery} 
                    onChange={(e)=> setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-button">
                    Search
                </button>

                <GenreFilter
                    genres={genres}
                    selectedGenre={selectedGenre}
                    onChange={handleGenreChange}
                />
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">
                    Loading...
                </div>
            ) : (
                <>
                    <div className="movies-grid">
                        {movies.map((movie) => (
                            <MovieCard movie={movie} key={movie.id} />
                        ))}
                    </div>
                    
                    <div className="pagination">
                        <button
                            onClick={() => changePage(page - 1)}
                            disabled={page === 1}
                        >
                            ← Previous
                        </button>
                        <span>
                            Page {page} of {Math.min(totalPages, 500)}
                        </span>
                        <button
                            onClick={() => changePage(page + 1)}
                            disabled={page >= totalPages || page >= 500}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default Home