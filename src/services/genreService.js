const API_URL = import.meta.env.VITE_API_URL;

export async function getGenres() {
    try {
        const response = await fetch(`${API_URL}/api/generos`, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(
                `Error al obtener los géneros (${response.status})`
            );
        }

        const genres = await response.json();

        if (!Array.isArray(genres)) {
            throw new Error(
                "La respuesta de géneros del servidor no es válida."
            );
        }

        return genres;

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "No se puede conectar con el servidor de géneros.",
                { cause: error }
            );
        }

        throw error;
    }
}
