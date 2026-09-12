import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { getMovieDetails } from "../services/api"
import '../css/MovieDetails.css'

function MovieDetails() {
    const { movieId } = useParams(); // gets movieId from url

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const movieData = await getMovieDetails(movieId);
                setMovie(movieData);
            } catch (err) {
                console.log(err);
                setError("Failed to load movie details.");
            } finally {
                setLoading(false);
            }
        };
        loadMovie();
    }, [movieId]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }
    if (error) {
        return <div className="error-message">{error}</div>;
    }
    if (!movie) {
        return <div className="error-message">Movie not found.</div>;
    }

    const director = movie.credits?.crew?.find(
        (person) => person.job === "Director"
    );
    const screenplayWriters = movie.credits?.crew?.filter(
        (person) => person.job === "Screenplay"
    );
    const storyWriters = movie.credits?.crew?.filter(
        (person) => person.job === "Story"
    );
    const Writers = movie.credits?.crew?.filter(
        (person) => person.job === "Writer"
    );
    const Characters = movie.credits?.crew?.filter(
        (person) => person.job === "Characters"
    );
    const usReleaseInfo = movie.release_dates?.results?.find(
    (country) => country.iso_3166_1 === "US"
    );
    const ageRating = usReleaseInfo?.release_dates?.find(
        (release) => release.certification
    )?.certification;

    return (
        <div className="movie-details">

            <Link to="/" className="back-button">
                ← Back
            </Link>

            <div className="movie-details-content">
                <img
                    className="movie-details-poster"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                />
                <div className="movie-details-info">

                    <h1>{movie.title}</h1>

                    <div className="movie-meta">
                        <span>
                            {ageRating}
                        </span>
                        <span>•</span>
                        <span>
                            {movie.release_date?.slice(0, 4)}
                        </span>
                        <span>•</span>
                        <span>
                            {movie.genres?.map((genre) => genre.name).join(", ")}
                        </span>
                    </div>

                    <div className="movie-rating">
                        ⭐ {movie.vote_average?.toFixed(1)} / 10
                    </div>

                    <h2>Overview</h2>
                    <p className="movie-overview">
                        {movie.overview || "No summary available."}
                    </p>

                    <div className="movie-crew">
                        {director && (
                            <p>
                                <strong>Director:</strong>{" "}
                                {director.name}
                            </p>
                        )}
                        {screenplayWriters?.length > 0 && (
                            <p>
                                <strong>Screenplay:</strong>{" "}
                                {screenplayWriters.map((person) => person.name).join(", ")}
                            </p>
                        )}
                        {storyWriters?.length > 0 && (
                            <p>
                                <strong>Story:</strong>{" "}
                                {storyWriters.map((person) => person.name).join(", ")}
                            </p>
                        )}
                        {Writers?.length > 0 && (
                            <p>
                                <strong>Writers:</strong>{" "}
                                {Writers.map((person) => person.name).join(", ")}
                            </p>
                        )}
                        {Characters?.length > 0 && (
                            <p>
                                <strong>Characters:</strong>{" "}
                                {Characters.map((person) => person.name).join(", ")}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieDetails;