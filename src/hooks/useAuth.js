import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { obtenerUsuarioActual } from "../services/authService";

export function useAuth() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            try {
                setLoading(true);
                const currentUser = await obtenerUsuarioActual();

                if (active) {
                    setUser(currentUser);
                }
            } catch (error) {
                console.error("Error al comprobar la sesión:", error);
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        checkSession();

        const handleFocus = () =>{
            checkSession();
        }
        window.addEventListener("focus", handleFocus);
        return () => {
            active = false;
             window.removeEventListener("focus", handleFocus);
        };
    }, [location.pathname]);

    return { user, loading };
}
