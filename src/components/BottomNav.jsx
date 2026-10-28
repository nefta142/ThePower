import { NavLink } from "react-router-dom";
import { House, Heart, CircleHelp, UserRound } from "lucide-react"

import "./BottomNav.css"

function BottomNav() {
    return (
        <nav className="bottom-nav" aria-label="Navegación principal">
            <NavLink to="/" end className="nav-item">
                <House aria-hidden="true" />
                <span>Inicio</span>
            </NavLink>

            <NavLink to="/favoritos" end className="nav-item">
                <Heart aria-hidden="true" />
                <span>Favoritos</span>
            </NavLink>

            <NavLink to="/ayuda" end className="nav-item">
                <CircleHelp aria-hidden="true" />
                <span>Ayuda</span>
            </NavLink>

            <NavLink to="/login" end className="nav-item">
                <UserRound aria-hidden="true" />
                <span>Cuenta</span>
            </NavLink>


        </nav>
    );
}

export default BottomNav;