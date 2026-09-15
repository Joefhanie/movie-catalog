import "../css/NavBar.css"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { ChevronDown, UserCircle } from "lucide-react"
import { useEffect, useRef, useState } from "react"

function NavBar() {
    const { session, signOut } = useAuth()
    const [accountOpen, setAccountOpen] = useState(false)
    const accountMenuRef = useRef(null)

    useEffect(() => {
        const closeAccountMenu = (event) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
                setAccountOpen(false)
            }
        }

        document.addEventListener("mousedown", closeAccountMenu)
        return () => document.removeEventListener("mousedown", closeAccountMenu)
    }, [])

    useEffect(() => {
        const closeAccountMenuWithEscape = (event) => {
            if (event.key === "Escape") setAccountOpen(false)
        }

        document.addEventListener("keydown", closeAccountMenuWithEscape)
        return () => document.removeEventListener("keydown", closeAccountMenuWithEscape)
    }, [])

    return <nav className="navbar navbar-expand navbar-dark">
        <div className="container-fluid px-0">
            <Link to="/" className="navbar-brand">Movie Catalog</Link>
            <div className="navbar-nav ms-auto">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/favorites" className="nav-link">Favorites</Link>
                {session ? (
                    <div className="account-menu" ref={accountMenuRef}>
                        <button
                            className="account-toggle"
                            aria-label="Open account menu"
                            aria-expanded={accountOpen}
                            onClick={() => setAccountOpen(!accountOpen)}
                        >
                            <UserCircle size={22} />
                            <ChevronDown size={15} />
                        </button>
                        {accountOpen && (
                            <div className="account-dropdown">
                                <span className="account-email">{session.user.email}</span>
                                <button className="account-signout" onClick={signOut}>Sign out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="nav-link">Log in</Link>
                )}
            </div>
        </div>
    </nav>
}

export default NavBar