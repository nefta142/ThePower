import { Heart, Music2, Play, Pause } from "lucide-react";
import { useState } from "react";

import { usePlayer } from "../context/PlayerContext";

import "./SongCard.css";

const API_URL = import.meta.env.VITE_API_URL;

function getImageUrl(image) {
    if (!image) {
        return "";
    }

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    return `${API_URL}/${image.replace(/^\/+/, "")}`;
}

function SongCard({
    id,
    title,
    genre,
    image,
    audio,
    songs = [],
    showPlayer = true
}) {
    const [imageError, setImageError] = useState(false);

    const {
        currentSong,
        isPlaying,
        playSong,
        togglePlay
    } = usePlayer();

    const imageUrl = getImageUrl(image);

    const isCurrentSong = currentSong?.idCancion === id;
    const isCurrentPlaying = isCurrentSong && isPlaying;

    const handlePlay = () => {
        if (!audio) return;

        if (isCurrentSong) {
            togglePlay();
            return;
        }

        const selectedSong = {
            idCancion: id,
            titulo: title,
            genero: genre,
            imagen: image,
            audio
        };

        const playlist = songs.length > 0
            ? songs
            : [selectedSong];

        playSong(selectedSong, playlist);
    };

    return (
        <article className="song-card">
            <div className="song-card-cover-container">
                {image && !imageError ? (
                    <img
                        src={imageUrl}
                        alt={`Portada de ${title}`}
                        className="song-card-image"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div
                        className="song-card-image song-card-placeholder"
                        role="img"
                        aria-label={`Portada no disponible para ${title}`}
                    >
                        <Music2 aria-hidden="true" />
                    </div>
                )}

                {showPlayer && (
                    <button
                        type="button"
                        className="song-card-play"
                        onClick={handlePlay}
                        disabled={!audio}
                        aria-label={
                            !audio
                                ? `Audio no disponible para ${title}`
                                : isCurrentPlaying
                                    ? `Pausar ${title}`
                                    : `Reproducir ${title}`
                        }
                        title={
                            !audio
                                ? "Audio no disponible"
                                : isCurrentPlaying
                                    ? "Pausar"
                                    : "Reproducir"
                        }
                    >
                        {isCurrentPlaying ? (
                            <Pause aria-hidden="true" />
                        ) : (
                            <Play aria-hidden="true" />
                        )}
                    </button>
                )}
            </div>

            <div className="song-card-info">
                <div className="song-card-text">
                    <h3>{title}</h3>
                    <p>{genre}</p>
                </div>

                <button
                    type="button"
                    className="song-card-favorite"
                    aria-label={`Añadir ${title} a favoritos`}
                    title="Favoritos disponibles próximamente"
                    disabled
                >
                    <Heart aria-hidden="true" />
                </button>
            </div>
        </article>
    );
}

export default SongCard;