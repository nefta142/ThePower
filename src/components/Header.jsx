import { Link } from "react-router-dom";
import { Search, UserRound } from "lucide-react";
import "./Header.css"

function Header() {
    return (
        <header className="header">
            <Link to="/" className="header-logo">The Power</Link>
            <div className="header-actions">
                <button type="button" className="header-search" aria-label="Buscar música">
                    <Search aria-hidden="true" />
                </button>
                <Link to="/login" className="header-profile" aria-label="Iniciar sesión">
                    <UserRound aria-hidden="true" />
                </Link>
            </div>
        </header>
    )
}

export default Header;