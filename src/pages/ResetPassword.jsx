import "../css/Auth.css"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function ResetPassword() {
    const { updatePassword } = useAuth()
    const navigate = useNavigate()
    const [password, setPassword] = useState("")
    const [message, setMessage] = useState("")

    const handleSubmit = async (event) => {
        event.preventDefault()
        const { error } = await updatePassword(password)
        if (error) return setMessage(error.message)
        setMessage("Your password has been updated.")
        setTimeout(() => navigate("/login"), 1500)
    }

    return <main className="auth-page">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h1>Choose a new password</h1>
            {message && <p className="auth-message">{message}</p>}
            <label htmlFor="new-password">New password</label>
            <input id="new-password" type="password" minLength="6" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button className="btn btn-danger" type="submit">Update password</button>
            <Link to="/login">Back to log in</Link>
        </form>
    </main>
}

export default ResetPassword
