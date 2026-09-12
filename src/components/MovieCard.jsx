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
            </div> 

        </div> 
    </Link> 
    ) 
}

export default MovieCard