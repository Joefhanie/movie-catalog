import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { deleteFavorite, getFavorites, saveFavorite } from "../services/favorites";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext)

export const MovieProvider = ({children}) => {
    const { session } = useAuth();
    const [favorites, setFavorites] = useState([])
    const userId = session?.user?.id

    useEffect(() => {
        if (!userId) {
            setFavorites([])
            return
        }

        const loadFavorites = async () => {
            try {
                setFavorites(await getFavorites(userId))
            } catch (error) {
                console.error("Failed to load favorites", error)
                setFavorites([])
            }
        }

        loadFavorites()
    }, [userId])

    const addToFavorites = async (movie) => {
        if (!userId) return

        try {
            await saveFavorite(userId, movie)
            setFavorites(prev => prev.some(favorite => favorite.id === movie.id)
                ? prev
                : [...prev, movie])
        } catch (error) {
            console.error("Failed to save favorite", error)
        }
    }

    const removeFromFavorites = async (movieId) => {
        if (!userId) return

        try {
            await deleteFavorite(userId, movieId)
            setFavorites(prev => prev.filter(movie => movie.id !== movieId))
        } catch (error) {
            console.error("Failed to remove favorite", error)
        }
    }

    const isFavorite = (movieId) => {
        return favorites.some(movie => movie.id === movieId)
    }

    const value = {
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite
    }

    return <MovieContext.Provider value={value}>
        {children}
    </MovieContext.Provider>
}