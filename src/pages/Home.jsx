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

    useEffect(()=>{
        const loadPopularMovies = async () => {
            try{
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
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
            const searchResults = await searchMovies(searchQuery)
            setMovies(searchResults)
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

        if (genreId === "") {
            const movies = await getPopularMovies();
            setMovies(movies);
        } else {
            const movies = await getMoviesByGenre(genreId);
            setMovies(movies);
        }
    };
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
            
            {loading ? ( <div className="loading">Loading...</div> // if loading show div
            ) : (                                                  // else
                <div className="movies-grid">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} key={movie.id} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default Home