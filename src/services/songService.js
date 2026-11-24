const API_URL = import.meta.env.VITE_API_URL;

export async function getSongs(searchText = "", genreID = null) {
    const params = new URLSearchParams();

    if (searchText.trim()) {
        params.append("texto", searchText.trim());
    }

    if (genreID !== null && genreID !== "") {
        params.append("genero", String(genreID));
    }

    const query = params.toString();

    const url = `${API_URL}/api/canciones${query ? `?${query}` : ""}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(
                `Error al obtener las canciones (${response.status})`
            );
        }

        const songs = await response.json();

        if (!Array.isArray(songs)) {
            throw new Error(
                "La respuesta del servidor no es válida"
            );
        }

        return songs;
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "No se puede conectar con el servidor",
                { cause: error }
            );
        }

        throw error;
    }

}

export async function uploadSong(songData) {
    try {

        const csrfResponse = await fetch(
            `${API_URL}/api/usuarios/csrf`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!csrfResponse.ok) {
            throw new Error(
                "No se pudo obtener el token de seguridad."
            );
        }

        const csrf = await csrfResponse.json();


        const formData = new FormData();

        formData.append("titulo", songData.title.trim());
        formData.append("idGenero", String(songData.genreId));
        formData.append("audio", songData.audio);
        formData.append("imagen", songData.image);

        const response = await fetch(
            `${API_URL}/api/canciones`,
            {
                method: "POST",
                credentials: "include",
                headers: {
                    [csrf.headerName]: csrf.token
                },
                body: formData
            }
        );

        if (!response.ok) {
            let errorMessage = "No se pudo subir la canción.";

            const errorData = await response.json().catch(() => null);

            if (typeof errorData?.message === "string") {
                errorMessage = errorData.message;
            } else if (typeof errorData?.mensaje === "string") {
                errorMessage = errorData.mensaje;
            } else if (response.status === 401 || response.status === 403) {
                errorMessage =
                    "No tienes autorización para subir canciones. Comprueba tu sesión.";
            } else if (response.status === 413) {
                errorMessage =
                    "El tamaño del archivo supera el límite permitido.";
            }

            throw new Error(errorMessage);
        }

        return await response.json();

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "No se puede conectar con el servidor Java.",
                { cause: error }
            );
        }

        throw error;
    }
}

export async function getArtistSongs(artistId) {
    if (!Number.isInteger(Number(artistId)) || Number(artistId) <= 0) {
        throw new Error("El identificador del artista no es válido.");
    }

    try {
        const response = await fetch(
            `${API_URL}/api/artistas/${artistId}/canciones`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (response.status === 404) {
            return [];
        }

        if (!response.ok) {
            throw new Error(
                `No se pudieron obtener las canciones (${response.status}).`
            );
        }

        const songs = await response.json();

        if (!Array.isArray(songs)) {
            throw new Error(
                "La respuesta del servidor no es válida."
            );
        }

        return songs;

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "No se puede conectar con el servidor Java.",
                { cause: error }
            );
        }

        throw error;
    }
}

export async function updateSong(songId, songData) {
    try {
        const csrfResponse = await fetch(
            `${API_URL}/api/usuarios/csrf`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!csrfResponse.ok) {
            throw new Error(
                "No se pudo obtener el token de seguridad."
            );
        }

        const csrf = await csrfResponse.json();

        const formData = new FormData();

        formData.append("titulo", songData.title.trim());
        formData.append("idGenero", String(songData.genreId));

        if (songData.audio) {
            formData.append("audio", songData.audio);
        }

        if (songData.image) {
            formData.append("imagen", songData.image);
        }

        const response = await fetch(
            `${API_URL}/api/canciones/${songId}`,
            {
                method: "PUT",
                credentials: "include",
                headers: {
                    [csrf.headerName]: csrf.token
                },
                body: formData
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            let errorMessage = "No se pudo modificar la canción.";

            if (typeof errorData?.message === "string") {
                errorMessage = errorData.message;
            } else if (typeof errorData?.mensaje === "string") {
                errorMessage = errorData.mensaje;
            } else if (response.status === 403) {
                errorMessage =
                    "No tienes permisos para modificar esta canción.";
            } else if (response.status === 404) {
                errorMessage = "La canción no existe.";
            }

            throw new Error(errorMessage);
        }

        return await response.json();

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "No se puede conectar con el servidor Java.",
                { cause: error }
            );
        }

        throw error;
    }
}


export async function deleteSong(songId) {
    try {
        const csrfResponse = await fetch(
            `${API_URL}/api/usuarios/csrf`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!csrfResponse.ok) {
            throw new Error(
                "No se pudo obtener el token de seguridad."
            );
        }

        const csrf = await csrfResponse.json();

        const response = await fetch(
            `${API_URL}/api/canciones/${songId}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    [csrf.headerName]: csrf.token
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);

            let errorMessage = "No se pudo eliminar la canción.";

            if (response.status === 409) {
                errorMessage =
                    "No puedes eliminar esta canción porque tiene otros colaboradores.";
            } else if (response.status === 403) {
                errorMessage =
                    "No tienes permisos para eliminar esta canción.";
            } else if (response.status === 404) {
                errorMessage = "La canción no existe.";
            } else if (typeof errorData?.message === "string") {
                errorMessage = errorData.message;
            } else if (typeof errorData?.mensaje === "string") {
                errorMessage = errorData.mensaje;
            }

            throw new Error(errorMessage);
        }

        return true;

    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error(
                "No se puede conectar con el servidor Java.",
                { cause: error }
            );
        }

        throw error;
    }
}

