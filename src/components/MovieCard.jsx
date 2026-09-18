import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"
import { Link } from "react-router-dom"

function MovieCard({movie}) {
    
    const {isFavorite, addToFavorites, removeFromFavorites, genres}= useMovieContext()
    const favorite = isFavorite(movie.id)

    function onFavouriteClick(e){
        e.preventDefault()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }
    const movieGenres = movie.genre_ids
    ?.map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter(Boolean)
    .join(", ");

    function timeAgo(dateString) {
        if (!dateString) return "";

        const releaseDate = new Date(dateString);
        const now = new Date();
        const diffTime = now - releaseDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 30) {
            return diffDays <= 0 ? "Today" : `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
        }

        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths < 12) {
            return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
        }

        const diffYears = Math.floor(diffMonths / 12);
        return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
    }

    return ( 
    <Link to={`/movie/${movie.id}`} className="movie-card-link">

        <div className="movie-card">
            <div className="movie-poster">

            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} /> 

            <div className="movie-overlay"> 

                <button className={`favourite-btn ${favorite ? "active" : ""}`} onClick={onFavouriteClick}>
                    {favorite ? "❤️" : "🤍"}
                </button> 

                <div className="movie-hover-info"> 
                    <div className="movie-hover-rating"> 
                        ⭐ {movie.vote_average?.toFixed(1)} / 10
                    </div> 

                    <div className="movie-hover-genres"> 
                        {movieGenres}
                    </div>
                    </div> 
                </div> 
            </div> 
            <div className="movie-info"> 
                <h3>{movie.title}</h3> 
                <p>{movie.release_date}</p> 
                <p className="movie-release-ago">{timeAgo(movie.release_date)}</p>
            </div>
        </div> 
    </Link> 
    ) 
}

export default MovieCard