import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../services/supabase"

const AuthContext = createContext(null)

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!supabase) {
            setLoading(false)
            return undefined
        }

        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session)
            setLoading(false)
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession)
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    const signUp = (email, password) => {
        if (!supabase) return Promise.resolve({ error: new Error("Add your Supabase environment variables first.") })
        return supabase.auth.signUp({ email, password })
    }

    const signIn = (email, password) => {
        if (!supabase) return Promise.resolve({ error: new Error("Add your Supabase environment variables first.") })
        return supabase.auth.signInWithPassword({ email, password })
    }

    const resetPassword = (email) => {
        if (!supabase) return Promise.resolve({ error: new Error("Add your Supabase environment variables first.") })
        return supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })
    }

    const updatePassword = (password) => {
        if (!supabase) return Promise.resolve({ error: new Error("Add your Supabase environment variables first.") })
        return supabase.auth.updateUser({ password })
    }

    const signOut = () => supabase?.auth.signOut()

    return (
        <AuthContext.Provider value={{ session, loading, signUp, signIn, resetPassword, updatePassword, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
