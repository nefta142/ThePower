const API_URL = import.meta.env.VITE_API_URL;

export async function getSongs(searchText="", genreID = null) {
    const params = new URLSearchParams();

    if(searchText.trim()){
        params.append("texto",searchText.trim());
    }

    if(genreID !== null && genreID !== ""){
        params.append("genero", String(genreID));
    }

    const query= params.toString();

    const url= `${API_URL}/api/canciones${query ? `?${query}` : ""}`;

    try{
        const response = await fetch(url,{
            method: "GET",
            credentials: "include"
        });

        if(!response.ok){
            throw new Error(
                `Error al obtener las canciones (${response.status})`
            );
        }

        const songs = await response.json();

        if(!Array.isArray(songs)){
            throw new Error(
                "La respuesta del servidor no es válida"
            );
        }

        return songs;
    } catch(error){
        if(error instanceof TypeError){
            throw new Error(
                "No se puede conectar con el servidor",
                {cause: error}
            );
        }

        throw error;
    }
    
}