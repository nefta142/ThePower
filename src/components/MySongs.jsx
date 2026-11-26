
import { useEffect, useState } from "react";
import { Music2, RefreshCw, Pencil, Trash2, X } from "lucide-react";

import SongCard from "./SongCard";
import SongEditForm from "./SongEditForm";

import {
    getArtistSongs,
    deleteSong
} from "../services/songService";

import "./MySongs.css";

function MySongs({ userId, refreshKey = 0 }) {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [retry, setRetry] = useState(0);
    const [editingSongId, setEditingSongId] = useState(null);
    const [deletingSongId, setDeletingSongId] = useState(null);

    const editingSong = songs.find(
        (song) => song.idCancion === editingSongId
    );

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


    const handleEdit = (songId) => {
        setEditingSongId(songId);
        setDeletingSongId(null);
        setError("");
        setSuccess("");
    };

    const handleSave = (updatedSong) => {
        setSongs((previous) =>
            previous.map((song) =>
                song.idCancion === updatedSong.idCancion
                    ? updatedSong
                    : song
            )
        );

        setEditingSongId(null);
        setSuccess("La canción se ha actualizado correctamente.");

        setRetry((previous) => previous + 1);
    };

    const handleDeleteClick = (songId) => {
        setDeletingSongId(songId);
        setEditingSongId(null);
        setError("");
        setSuccess("");
    };

    const handleConfirmDelete = async (songId) => {
        try {
            setError("");
            setDeletingSongId(null);

            const result = await deleteSong(songId);

            if (result) {
                setSongs((previous) =>
                    previous.filter((song) => song.idCancion !== songId)
                );

                setSuccess("La canción se ha eliminado correctamente.");
                setRetry((previous) => previous + 1);
            }

        } catch (err) {
            setError(
                err.message || "No se pudo eliminar la canción."
            );
        }
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

            {error && (
                <div className="my-songs-error" role="alert">
                    <p>{error}</p>

                    <button
                        type="button"
                        className="my-songs-retry"
                        onClick={() =>
                            setRetry((previous) => previous + 1)
                        }
                    >
                        <RefreshCw aria-hidden="true" />
                        Reintentar
                    </button>
                </div>
            )}

            {success && (
                <div className="my-songs-success" role="status">
                    <span>{success}</span>

                    <button
                        type="button"
                        className="my-songs-close"
                        onClick={() => setSuccess("")}
                        aria-label="Cerrar mensaje"
                    >
                        <X aria-hidden="true" />
                    </button>
                </div>
            )}

            {loading && (
                <p className="my-songs-status" role="status">
                    Cargando tus canciones...
                </p>
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
                        <div
                            className="my-songs-item"
                            key={song.idCancion}
                        >
                            <SongCard
                                title={song.titulo}
                                genre={song.genero}
                                image={song.imagen}
                                showPlayer={false}
                            />

                            <div className="my-songs-actions">
                                <button
                                    type="button"
                                    className="my-songs-edit"
                                    onClick={() =>
                                        handleEdit(song.idCancion)
                                    }
                                >
                                    <Pencil aria-hidden="true" />
                                    Editar
                                </button>

                                <button
                                    type="button"
                                    className="my-songs-delete"
                                    onClick={() =>
                                        handleDeleteClick(song.idCancion)
                                    }
                                >
                                    <Trash2 aria-hidden="true" />
                                    Eliminar
                                </button>
                            </div>



                            {deletingSongId === song.idCancion && (
                                <div
                                    className="my-songs-confirm"
                                    role="group"
                                    aria-label={`Confirmar eliminación de ${song.titulo}`}
                                >
                                    <p>
                                        ¿Seguro que quieres eliminar
                                        "{song.titulo}"?
                                    </p>

                                    <p>
                                        Esta acción no se puede deshacer.
                                    </p>

                                    <div className="my-songs-confirm-actions">
                                        <button
                                            type="button"
                                            className="my-songs-cancel"
                                            onClick={() =>
                                                setDeletingSongId(null)
                                            }
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            type="button"
                                            className="my-songs-confirm-delete"
                                            onClick={() =>
                                                handleConfirmDelete(
                                                    song.idCancion
                                                )
                                            }
                                        >
                                            Eliminar definitivamente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && editingSong && (
                <div className="my-songs-edit-container">
                    <SongEditForm
                        key={editingSong.idCancion}
                        song={editingSong}
                        onSave={handleSave}
                        onCancel={() => setEditingSongId(null)}
                    />
                </div>
            )}

        </section>
    );
}

export default MySongs;