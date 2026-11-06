import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { obtenerUsuarioActual } from "../services/authService";

function ProtectedRoute() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const checkSession = async () => {
            try {
                const currentUser = await obtenerUsuarioActual();

                if (active) {
                    setUser(currentUser);
                }
            } catch {
                if (active) {
                    setError("No se pudo comprobar la sesión con el servidor.");
                }
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

    if (loading) {
        return (
            <main role="status">
                <p>Comprobando sesión...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main role="alert">
                <p>{error}</p>
            </main>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet context={{ user }} />;
}

export default ProtectedRoute;
