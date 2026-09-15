import "../css/NavBar.css"
import { Link } from "react-router-dom"

function NavBar() {
    return <nav className="navbar navbar-expand navbar-dark">
        <div className="container-fluid px-0">
            <Link to="/" className="navbar-brand">Movie Catalog</Link>
            <div className="navbar-nav ms-auto">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/favorites" className="nav-link">Favorites</Link>
            </div>
        </div>
    </nav>
}

export default NavBar