import "../css/MovieCard.css"
import { useMovieContext } from "../contexts/MovieContext"

const genreNames = {
    12: "Adventure",
    14: "Fantasy",
    16: "Animation",
    18: "Drama",
    27: "Horror",
    28: "Action",
    35: "Comedy",
    37: "Western",
    53: "Thriller",
    80: "Crime",
    99: "Documentary",
    878: "Science Fiction",
    9648: "Mystery",
    10749: "Romance",
    10751: "Family",
    10752: "War"
};

function MovieCard({ movie }) {
    const {isFavorite, addToFavorites, removeFromFavorites} = useMovieContext();
    const favorite = isFavorite(movie.id)
    const genres = movie.genre_ids
        ?.map((genreId) => genreNames[genreId])
        .filter(Boolean)
        .slice(0, 2)

    function onFavorite(e) {
        e.preventDefault()
        if (favorite) removeFromFavorites(movie.id)
        else addToFavorites(movie)
    }

    return <div className="movie-card">
        <div className="movie-poster">
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            <div className="movie-overlay">
                <p className="movie-description">
                    {movie.overview || "No description available."}
                </p>
                <button className={`favorite-btn ${favorite ? "active" : ""}`} onClick={onFavorite}>♥</button>
            </div>
        </div>
        <div className="movie-info">
            <h3>{movie.title}</h3>
            <p>{movie.release_date?.split("-")[0]}</p>
            {genres?.length > 0 && (
                <div className="movie-genres">
                    {genres.map((genre) => (
                        <span className="genre-pill" key={genre}>{genre}</span>
                    ))}
                </div>
            )}
        </div>
    </div>
}

export default MovieCard