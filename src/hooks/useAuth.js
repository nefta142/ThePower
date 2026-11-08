import { useEffect, useState } from "react";
import { obtenerUsuarioActual } from "../services/authService";

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            try {
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

        return () => {
            active = false;
        };
    }, []);

    return { user, loading };
}
