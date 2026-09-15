import { supabase } from "./supabase"

export async function getFavorites(userId) {
    const { data, error } = await supabase
        .from("favorites")
        .select("movie")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) throw error
    return data.map((favorite) => favorite.movie)
}

export async function saveFavorite(userId, movie) {
    const { error } = await supabase
        .from("favorites")
        .upsert({ user_id: userId, movie_id: movie.id, movie }, { onConflict: "user_id,movie_id" })

    if (error) throw error
}

export async function deleteFavorite(userId, movieId) {
    const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movieId)

    if (error) throw error
}
