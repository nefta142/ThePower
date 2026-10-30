import { Link } from "react-router-dom";
import { Search, UserRound } from "lucide-react";
import FeedBack from "./FeedBack";
import "./Header.css"
import { useState } from "react";

function Header() {
    const [message, setMesage] = useState("");
    return (
        <>
            <header className="header">
                <Link to="/" className="header-logo">
                <img src="/images/Logo.png" className="header-logo-img"></img>
                The Power</Link>
                <div className="header-actions">
                    <button type="button" className="header-search" aria-label="Buscar música" onClick={() => setMesage("La búsqueda estará disponible próximamnete.")}>
                        <Search aria-hidden="true" />
                    </button>
                    <Link to="/login" className="header-profile" aria-label="Iniciar sesión">
                        <UserRound aria-hidden="true" />
                    </Link>
                </div>
            </header>
            <FeedBack message={message} onClose={() => setMesage("")} />
        </>
    )
}

export default Header;