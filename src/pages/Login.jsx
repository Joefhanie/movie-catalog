import "../css/Auth.css"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function Login() {
    const { signIn } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        setMessage("")
        const { error } = await signIn(email, password)
        if (error) return setMessage(error.message)
        navigate("/")
    }

    return <AuthForm title="Welcome back" buttonText="Log in" onSubmit={handleSubmit} email={email} setEmail={setEmail} password={password} setPassword={setPassword} message={message}>
        <p>Need an account? <Link to="/signup">Sign up</Link></p>
        <Link to="/forgot-password">Forgot your password?</Link>
    </AuthForm>
}

function AuthForm({ title, buttonText, onSubmit, email, setEmail, password, setPassword, message, children }) {
    return <main className="auth-page">
        <form className="auth-form" onSubmit={onSubmit}>
            <h1>{title}</h1>
            {message && <p className="auth-message">{message}</p>}
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button className="btn btn-danger" type="submit">{buttonText}</button>
            <div className="auth-links">{children}</div>
        </form>
    </main>
}

export default Login
