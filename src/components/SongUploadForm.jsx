import { useEffect, useState, useRef } from "react";
import { Upload, Music2, ImagePlus } from "lucide-react";

import { getGenres } from "../services/genreService";
import { uploadSong } from "../services/songService";

import "./SongUploadForm.css";

function SongUploadForm({onUploadSuccess}) {
    const [title, setTitle] = useState("");
    const [genreId, setGenreId] = useState("");
    const [audio, setAudio] = useState(null);
    const [image, setImage] = useState(null);

    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const formRef = useRef(null);

    useEffect(() => {
        let active = true;

        const loadGenres = async () => {
            try {
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
        setSuccess("");

        if (!title.trim()) {
            setError("Introduce el título de la canción.");
            return;
        }

        if (title.trim().length > 100) {
            setError("El título no puede superar 100 caracteres.");
            return;
        }

        if (!genreId) {
            setError("Selecciona un género musical.");
            return;
        }

        if (!audio) {
            setError("Selecciona un archivo de audio.");
            return;
        }

        if (!image) {
            setError("Selecciona una portada.");
            return;
        }

        if (!audio.type.startsWith("audio/")) {
            setError("El archivo seleccionado no es un audio válido.");
            return;
        }

        if (!image.type.startsWith("image/")) {
            setError("El archivo seleccionado no es una imagen válida.");
            return;
        }

        try {
            setLoading(true);

            await uploadSong({
                title,
                genreId,
                audio,
                image
            });
            
            onUploadSuccess?.();

            setTitle("");
            setGenreId("");
            setAudio(null);
            setImage(null);

           formRef.current?.reset();

            setSuccess("La canción se ha subido correctamente.");

        } catch (err) {
            setError(
                err.message || "No se pudo subir la canción."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="song-upload-section"
            aria-labelledby="song-upload-title"
        >
            <h2 id="song-upload-title">
                Subir canción
            </h2>

            <p className="song-upload-description">
                Comparte tu música con los usuarios de ThePower.
            </p>

            {error && (
                <p className="song-upload-error" role="alert">
                    {error}
                </p>
            )}

            {success && (
                <p className="song-upload-success" role="status">
                    {success}
                </p>
            )}

            <form
            ref={formRef}
                className="song-upload-form"
                onSubmit={handleSubmit}
            >
                <div className="song-upload-field">
                    <label htmlFor="song-title">
                        Título de la canción
                    </label>

                    <input
                        id="song-title"
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        maxLength={100}
                        placeholder="Introduce el título"
                        disabled={loading}
                        required
                    />
                </div>

                <div className="song-upload-field">
                    <label htmlFor="song-genre">
                        Género musical
                    </label>

                    <select
                        id="song-genre"
                        value={genreId}
                        onChange={(event) => setGenreId(event.target.value)}
                        disabled={loading || loadingGenres}
                        required
                    >
                        <option value="">
                            Selecciona un género
                        </option>

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

                <div className="song-upload-field">
                    <label htmlFor="song-audio">
                        Archivo de audio
                    </label>

                    <div className="song-upload-file">
                        <Music2 aria-hidden="true" />

                        <input
                            id="song-audio"
                            type="file"
                            accept="audio/*"
                            onChange={(event) =>
                                setAudio(event.target.files?.[0] || null)
                            }
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                <div className="song-upload-field">
                    <label htmlFor="song-image">
                        Portada de la canción
                    </label>

                    <div className="song-upload-file">
                        <ImagePlus aria-hidden="true" />

                        <input
                            id="song-image"
                            type="file"
                            accept="image/*"
                            onChange={(event) =>
                                setImage(event.target.files?.[0] || null)
                            }
                            disabled={loading}
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="song-upload-button"
                    disabled={loading || loadingGenres}
                >
                    <Upload aria-hidden="true" />
                    {loading ? "Subiendo canción..." : "Subir canción"}
                </button>
            </form>
        </section>
    );
}

export default SongUploadForm;
