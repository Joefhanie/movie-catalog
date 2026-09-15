import "../css/Auth.css"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function ForgotPassword() {
    const { resetPassword } = useAuth()
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        const { error } = await resetPassword(email)
        setMessage(error ? error.message : "Check your email for a password reset link.")
    }

    return <main className="auth-page">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h1>Reset password</h1>
            {message && <p className="auth-message">{message}</p>}
            <label htmlFor="reset-email">Email</label>
            <input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <button className="btn btn-danger" type="submit">Send reset link</button>
            <p><Link to="/login">Back to log in</Link></p>
        </form>
    </main>
}

export default ForgotPassword
