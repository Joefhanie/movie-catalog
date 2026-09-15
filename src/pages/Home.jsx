import "../css/Home.css"
import MovieCard from "../components/MovieCard"
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {movieGenres, searchMovies, getPopularMovies} from "../services/api"

function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeSearch, setActiveSearch] = useState("");
    const [sortFilter, setSortFilter] = useState("popular");
    const [genreFilter, setGenreFilter] = useState("");
    const [filtersOpen, setFiltersOpen] = useState(false);
    const filterMenuRef = useRef(null);
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const linkedSearch = searchParams.get("search") || "";

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies()
                setMovies(popularMovies)
            } catch (err) {
                console.log(err)
                setError("Failed to load movies...")
            }
            finally {
                setLoading(false)
            }
        }

        loadPopularMovies()
    }, [linkedSearch])

    useEffect(() => {
        if (!linkedSearch) return

        const loadLinkedSearch = async () => {
            setSearchQuery(linkedSearch)
            setLoading(true)

            try {
                const searchResults = await searchMovies(linkedSearch, sortFilter, genreFilter)
                setMovies(searchResults)
                setActiveSearch(linkedSearch)
                setError(null)
            } catch (err) {
                console.log(err)
                setError("Failed to load movies...")
            } finally {
                setLoading(false)
            }
        }

        loadLinkedSearch()
    }, [linkedSearch, sortFilter, genreFilter])
    useEffect(() => {
        const closeFiltersWhenClickingOutside = (event) => {
            if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
                setFiltersOpen(false)
            }
        }

        document.addEventListener("mousedown", closeFiltersWhenClickingOutside)
        return () => document.removeEventListener("mousedown", closeFiltersWhenClickingOutside)
    }, [])

    const loadMovies = async (query, selectedSort, selectedGenre) => {
        setLoading(true)
        try {
            const searchResults = await searchMovies(query, selectedSort, selectedGenre)
            setMovies(searchResults)
            setActiveSearch(query.trim())
            setError(null)
        } catch (err) {
            console.log(err)
            setError("Failed to load movies...")
        }
        finally {
            setLoading(false)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()

        if (!searchQuery.trim()) return
        if (loading) return

        await loadMovies(searchQuery, sortFilter, genreFilter)

        setSearchQuery("");
    }; 

    const handleFilterChange = async (filter) => {
        setSortFilter(filter)
        setFiltersOpen(false)

        if (!loading) {
            await loadMovies(activeSearch, filter, genreFilter)
        }
    }

    const handleGenreChange = async (event) => {
        const selectedGenre = event.target.value
        setGenreFilter(selectedGenre)

        if (!loading) {
            await loadMovies(activeSearch, sortFilter, selectedGenre)
        }
    }

    return (
    <div className="home container-fluid">
        <form onSubmit={handleSearch} className="search-form row g-2">
            <input
                type="text"
                placeholder="Search for Movies..."
                className="search-input form-control"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button btn btn-danger">Search</button>
            <div className="filter-menu" ref={filterMenuRef}>
                <button
                    type="button"
                    className="filter-button btn btn-outline-light"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    aria-expanded={filtersOpen}
                >
                    Filters <span aria-hidden="true">▾</span>
                </button>
                {filtersOpen && (
                    <div className="filter-dropdown">
                        <p className="filter-title">Sort results</p>
                        {["recent", "popular", "ascending", "descending"].map((filter) => (
                            <label className="filter-option" key={filter}>
                                <input
                                    type="checkbox"
                                    checked={sortFilter === filter}
                                    onChange={() => handleFilterChange(filter)}
                                />
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </label>
                        ))}
                        <label className="genre-filter-label" htmlFor="genre-filter">Genre</label>
                        <select
                            id="genre-filter"
                            className="genre-filter-select"
                            value={genreFilter}
                            onChange={handleGenreChange}
                        >
                            <option value="">All genres</option>
                            {Object.keys(movieGenres).map((genre) => (
                                <option value={genre} key={genre}>
                                    {genre.replace(/\b\w/g, (letter) => letter.toUpperCase())}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {activeSearch && <h2 className="search-results-title">Results for "{activeSearch}"</h2>}

        {loading ? (<div className="loading">Loading...</div>) 
        : (<div className="movies-grid">
            {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
            ))}
        </div>
        )}
    </div>)
}


export default Home;