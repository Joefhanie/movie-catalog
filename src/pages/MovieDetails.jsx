import "../css/MovieDetails.css"
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { getMovieDetails } from "../services/api"

function formatReleaseDate(releaseDate) {
    if (!releaseDate) return "Release date unknown"

    const [year, month] = releaseDate.split("-").map(Number)
    if (!year || !month) return releaseDate

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric"
    }).format(new Date(year, month - 1))
}

function MovieDetails() {
    const { movieId } = useParams()
    const navigate = useNavigate()
    const [movie, setMovie] = useState(null)
    const [error, setError] = useState(null)
    const [trailerOpen, setTrailerOpen] = useState(false)

    useEffect(() => {
        const loadMovie = async () => {
            try {
                const movieDetails = await getMovieDetails(movieId)
                setMovie(movieDetails)
            } catch (err) {
                console.log(err)
                setError("Failed to load movie details...")
            }
        }

        loadMovie()
    }, [movieId])

    useEffect(() => {
        const closeTrailerWithEscape = (event) => {
            if (event.key === "Escape") setTrailerOpen(false)
        }

        document.addEventListener("keydown", closeTrailerWithEscape)
        return () => document.removeEventListener("keydown", closeTrailerWithEscape)
    }, [])

    const trailer = movie?.videos?.results?.find((video) =>
        video.site === "YouTube" && video.type === "Trailer" && video.official
    ) || movie?.videos?.results?.find((video) =>
        video.site === "YouTube" && video.type === "Trailer"
    )
    const actors = movie?.credits?.cast?.slice(0, 8) || []
    const directors = movie?.credits?.crew?.filter((person) => person.job === "Director") || []

    const searchFor = (type, value) => {
        navigate(`/?search=${encodeURIComponent(`${type}: ${value}`)}`)
    }

    if (error) return <p className="movie-details-message">{error}</p>
    if (!movie) return <p className="movie-details-message">Loading movie details...</p>

    return (
        <article className="movie-details container-fluid">
            <Link to="/" className="back-link">← Back to movies</Link>
            <div className="movie-details-content">
                {movie.poster_path ? (
                    <img
                        className="movie-details-poster"
                        src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                        alt={movie.title}
                    />
                ) : (
                    <div className="movie-details-poster poster-placeholder">No poster available</div>
                )}
                <div className="movie-details-info">
                    <h1>{movie.title}</h1>
                    <p className="movie-details-tagline">{movie.tagline}</p>
                    <div className="movie-details-meta">
                        <span>{formatReleaseDate(movie.release_date)}</span>
                        <span>{movie.runtime ? `${movie.runtime} min` : "Runtime unknown"}</span>
                        <span>{movie.vote_average?.toFixed(1)} / 10</span>
                    </div>
                    <div className="movie-details-genres">
                        {movie.genres?.map((genre) => (
                            <button className="genre-pill badge" key={genre.id} onClick={() => searchFor("genre", genre.name)}>
                                {genre.name}
                            </button>
                        ))}
                    </div>
                    {actors.length > 0 && (
                        <div className="movie-details-people">
                            <h2>Cast</h2>
                            <div className="movie-details-pills">
                                {actors.map((actor) => (
                                    <button className="person-pill badge" key={actor.id} onClick={() => searchFor("actor", actor.name)}>
                                        {actor.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {directors.length > 0 && (
                        <div className="movie-details-people">
                            <h2>Director</h2>
                            <div className="movie-details-pills">
                                {directors.map((director) => (
                                    <button className="person-pill badge" key={director.id} onClick={() => searchFor("director", director.name)}>
                                        {director.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <h2>Overview</h2>
                    <p className="movie-overview">{movie.overview || "No description available."}</p>
                    {trailer && (
                        <button
                            className="view-trailer-button btn btn-danger"
                            onClick={() => setTrailerOpen(true)}
                        >
                            View Trailer
                        </button>
                    )}
                </div>
            </div>
            {trailerOpen && trailer && (
                <div className="trailer-modal" onClick={() => setTrailerOpen(false)}>
                    <div
                        className="trailer-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="trailer-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="trailer-dialog-header">
                            <h2 id="trailer-title">{movie.title} Trailer</h2>
                            <button
                                className="trailer-close-button"
                                aria-label="Close trailer"
                                onClick={() => setTrailerOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className="trailer-video-wrapper">
                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}`}
                                title={`${movie.title} trailer`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                </div>
            )}
        </article>
    )
}

export default MovieDetails
