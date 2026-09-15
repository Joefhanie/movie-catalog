import "../css/NavBar.css"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

function NavBar() {
    const { session, signOut } = useAuth()

    return <nav className="navbar navbar-expand navbar-dark">
        <div className="container-fluid px-0">
            <Link to="/" className="navbar-brand">Movie Catalog</Link>
            <div className="navbar-nav ms-auto">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/favorites" className="nav-link">Favorites</Link>
                {session ? (
                    <button className="nav-link nav-button" onClick={signOut}>Log out</button>
                ) : (
                    <Link to="/login" className="nav-link">Log in</Link>
                )}
            </div>
        </div>
    </nav>
}

export default NavBar