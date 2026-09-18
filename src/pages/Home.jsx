import MovieCard from "../components/MovieCard"
import {useState, useEffect} from "react"
import "../css/Home.css"
import { searchMovies, getPopularMovies, getGenres, getMoviesByGenre } from "../services/api"
import GenreFilter from "../components/GenreFilter"
import YearFilter from "../components/YearFilter"

function Home() {
    const [searchQuery, setSearchQuery] = useState("")
    const [movies, setMovies] = useState([]) // runs only the first time so its not constantly fetching all movies
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [genres, setGenres] = useState([])
    const [selectedGenre, setSelectedGenre] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [selectedYear, setSelectedYear] = useState("")

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

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
    const sortedMovies = [...movies].sort((a, b) => {
        switch (sortBy) {
            case "rating-asc":
                return a.vote_average - b.vote_average;

            case "rating-desc":
                return b.vote_average - a.vote_average;

            case "date-asc":
                return new Date(a.release_date || "9999-12-31") -
                    new Date(b.release_date || "9999-12-31");

            case "date-desc":
                return new Date(b.release_date || "0000-01-01") -
                    new Date(a.release_date || "0000-01-01");

            default:
                return 0;
        }
    })

    const currentYear = new Date().getFullYear();
    const displayedMovies = selectedYear
        ? sortedMovies.filter((movie) => {
            const releaseYear = new Date(movie.release_date).getFullYear();
            if (selectedYear === "40") return currentYear - releaseYear >= 40;
            return currentYear - releaseYear <= Number(selectedYear);
        })
        : sortedMovies;

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

                <select
                    className="sort-filter"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="">Sort by</option>
                    <option value="rating-asc">Rating: Low → High</option>
                    <option value="rating-desc">Rating: High → Low</option>
                    <option value="date-asc">Release Date: Old → New</option>
                    <option value="date-desc">Release Date: New → Old</option>
                </select>

                <YearFilter selectedYear={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} />
            </form>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">
                    Loading...
                </div>
            ) : (
                <>
                    <div className="movies-grid">
                        {displayedMovies.map((movie) => (
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