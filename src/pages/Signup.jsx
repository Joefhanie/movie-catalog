import "../css/Auth.css"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function Signup() {
    const { signUp } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        setMessage("")
        const { data, error } = await signUp(email, password)
        if (error) return setMessage(error.message)
        if (!data.session) return setMessage("Check your email to confirm your account.")
        navigate("/")
    }

    return <main className="auth-page">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h1>Create account</h1>
            {message && <p className="auth-message">{message}</p>}
            <label htmlFor="signup-email">Email</label>
            <input id="signup-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="signup-password">Password</label>
            <input id="signup-password" type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button className="btn btn-danger" type="submit">Sign up</button>
            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </form>
    </main>
}

export default Signup
