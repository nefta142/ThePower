import { useEffect, useState } from "react";
import { Music2, RefreshCw } from "lucide-react";

import SongCard from "./SongCard";
import { getArtistSongs } from "../services/songService";

import "./MySongs.css";

function MySongs({ userId, refreshKey=0 }) {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retry, setRetry] = useState(0);

    useEffect(() => {
        let active = true;

        const loadSongs = async () => {
            if (!userId) {
                setSongs([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await getArtistSongs(userId);

                if (active) {
                    setSongs(data);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.message || "No se pudieron cargar tus canciones."
                    );
                    setSongs([]);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        loadSongs();

        return () => {
            active = false;
        };
    }, [userId, retry, refreshKey]);

    const handleRetry = () => {
        setRetry((previous) => previous + 1);
    };

    return (
        <section
            className="my-songs"
            aria-labelledby="my-songs-title"
        >
            <div className="my-songs-header">
                <h2 id="my-songs-title">Mis canciones</h2>

                {!loading && !error && (
                    <span className="my-songs-count">
                        {songs.length}{" "}
                        {songs.length === 1 ? "canción" : "canciones"}
                    </span>
                )}
            </div>

            {loading && (
                <p className="my-songs-status" role="status">
                    Cargando tus canciones...
                </p>
            )}

            {error && (
                <div className="my-songs-error" role="alert">
                    <p>{error}</p>

                    <button
                        type="button"
                        className="my-songs-retry"
                        onClick={handleRetry}
                    >
                        <RefreshCw aria-hidden="true" />
                        Reintentar
                    </button>
                </div>
            )}

            {!loading && !error && songs.length === 0 && (
                <div className="my-songs-empty">
                    <Music2 aria-hidden="true" />

                    <p>Todavía no tienes canciones publicadas.</p>
                    <p>
                        Cuando subas una canción, aparecerá aquí.
                    </p>
                </div>
            )}

            {!loading && !error && songs.length > 0 && (
                <div className="my-songs-grid">
                    {songs.map((song) => (
                        <SongCard
                            key={song.idCancion}
                            title={song.titulo}
                            genre={song.genero}
                            image={song.imagen}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default MySongs;
