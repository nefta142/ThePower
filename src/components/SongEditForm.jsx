import { useEffect, useState } from "react";
import { Save, X, Music2, ImagePlus } from "lucide-react";

import { updateSong } from "../services/songService";
import { getGenres } from "../services/genreService";

import "./SongEditForm.css";

function SongEditForm({ song, onSave, onCancel }) {
    const [title, setTitle] = useState(song.titulo || "");
    const [genreId, setGenreId] = useState(
        String(song.idGenero ?? "")
    );

    const [audio, setAudio] = useState(null);
    const [image, setImage] = useState(null);

    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadGenres = async () => {
            try {
                setLoadingGenres(true);

                const data = await getGenres();

                if (active) {
                    setGenres(data);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.message || "No se pudieron cargar los géneros."
                    );
                }
            } finally {
                if (active) {
                    setLoadingGenres(false);
                }
            }
        };

        loadGenres();

        return () => {
            active = false;
        };
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        const cleanTitle = title.trim();

        if (!cleanTitle) {
            setError("Introduce el título de la canción.");
            return;
        }

        if (cleanTitle.length > 150) {
            setError("El título no puede superar 150 caracteres.");
            return;
        }

        if (!genreId) {
            setError("Selecciona un género musical.");
            return;
        }

        if (audio && !audio.type.startsWith("audio/")) {
            setError("Selecciona un archivo de audio válido.");
            return;
        }

        if (image && !image.type.startsWith("image/")) {
            setError("Selecciona una imagen válida.");
            return;
        }

        try {
            setLoading(true);

            const updatedSong = await updateSong(song.idCancion, {
                title: cleanTitle,
                genreId,
                audio,
                image
            });

            onSave(updatedSong);
        } catch (err) {
            setError(
                err.message || "No se pudieron guardar los cambios."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="song-edit-section"
            aria-labelledby={`song-edit-title-${song.idCancion}`}
        >
            <h3 id={`song-edit-title-${song.idCancion}`}>
                Editar canción
            </h3>

            <p className="song-edit-description">
                Modifica los datos de "{song.titulo}".
            </p>

            {error && (
                <p className="song-edit-error" role="alert">
                    {error}
                </p>
            )}

            <form
                className="song-edit-form"
                onSubmit={handleSubmit}
            >
                <div className="song-edit-field">
                    <label htmlFor={`song-edit-name-${song.idCancion}`}>
                        Título
                    </label>

                    <input
                        id={`song-edit-name-${song.idCancion}`}
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        maxLength={150}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="song-edit-field">
                    <label htmlFor={`song-edit-genre-${song.idCancion}`}>
                        Género musical
                    </label>

                    <select
                        id={`song-edit-genre-${song.idCancion}`}
                        value={genreId}
                        onChange={(event) => setGenreId(event.target.value)}
                        required
                        disabled={loading || loadingGenres}
                    >
                        <option value="">Selecciona un género</option>

                        {genres.map((genre) => (
                            <option
                                key={genre.idGenero}
                                value={genre.idGenero}
                            >
                                {genre.tipo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="song-edit-field">
                    <label htmlFor={`song-edit-audio-${song.idCancion}`}>
                        Sustituir audio (opcional)
                    </label>

                    <div className="song-edit-file">
                        <Music2 aria-hidden="true" />

                        <input
                            id={`song-edit-audio-${song.idCancion}`}
                            type="file"
                            accept="audio/*"
                            onChange={(event) =>
                                setAudio(event.target.files?.[0] || null)
                            }
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="song-edit-field">
                    <label htmlFor={`song-edit-image-${song.idCancion}`}>
                        Sustituir portada (opcional)
                    </label>

                    <div className="song-edit-file">
                        <ImagePlus aria-hidden="true" />

                        <input
                            id={`song-edit-image-${song.idCancion}`}
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                setImage(event.target.files?.[0] || null)
                            }
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="song-edit-actions">
                    <button
                        type="button"
                        className="song-edit-cancel"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        <X aria-hidden="true" />
                        Cancelar
                    </button>

                    <button
                        type="submit"
                        className="song-edit-save"
                        disabled={loading || loadingGenres || Boolean(error && genres.length === 0)}
                    >
                        <Save aria-hidden="true" />
                        {loading ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>
            </form>
        </section>
    );
}

export default SongEditForm;
