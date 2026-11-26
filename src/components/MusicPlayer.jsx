import { useState } from "react";
import {
    Music2,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    VolumeX
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";

import "./MusicPlayer.css";

const API_URL = import.meta.env.VITE_API_URL;

function getImageUrl(image) {
    if (!image) return "";

    if (
        image.startsWith("http://") ||
        image.startsWith("https://")
    ) {
        return image;
    }

    return `${API_URL}/${image.replace(/^\/+/, "")}`;
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function MusicPlayer() {
    const {
        currentSong,
        playlist,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        error,
        togglePlay,
        nextSong,
        previousSong,
        seek,
        changeVolume
    } = usePlayer();

    const [imageError, setImageError] = useState(false);

    if (!currentSong) {
        return null;
    }

    const imageUrl = getImageUrl(currentSong.imagen);
    const canGoPrevious = currentIndex > 0 || currentTime > 3;
    const canGoNext = currentIndex < playlist.length - 1;

    return (
        <section
            className="music-player"
            aria-label="Reproductor musical"
        >
            <div className="music-player-main">
                <div className="music-player-song">
                    {currentSong.imagen && !imageError ? (
                        <img
                            key={currentSong.idCancion}
                            src={imageUrl}
                            alt=""
                            className="music-player-cover"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="music-player-cover music-player-placeholder">
                            <Music2 aria-hidden="true" />
                        </div>
                    )}

                    <div className="music-player-info">
                        <p className="music-player-title">
                            {currentSong.titulo}
                        </p>

                        <p className="music-player-genre">
                            {currentSong.genero}
                        </p>
                    </div>
                </div>

                <div className="music-player-controls">
                    <button
                        type="button"
                        onClick={previousSong}
                        disabled={!canGoPrevious}
                        aria-label="Canción anterior"
                        title="Canción anterior"
                    >
                        <SkipBack aria-hidden="true" />
                    </button>

                    <button
                        type="button"
                        className="music-player-play"
                        onClick={togglePlay}
                        aria-label={
                            isPlaying ? "Pausar canción" : "Reproducir canción"
                        }
                        title={isPlaying ? "Pausar" : "Reproducir"}
                    >
                        {isPlaying ? (
                            <Pause aria-hidden="true" />
                        ) : (
                            <Play aria-hidden="true" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={nextSong}
                        disabled={!canGoNext}
                        aria-label="Siguiente canción"
                        title="Siguiente canción"
                    >
                        <SkipForward aria-hidden="true" />
                    </button>
                </div>
            </div>

            <div className="music-player-bottom">
                <span className="music-player-time">
                    {formatTime(currentTime)}
                </span>

                <input
                    type="range"
                    className="music-player-progress"
                    min="0"
                    max={duration > 0 ? duration : 1}
                    step="0.1"
                    value={Math.min(currentTime, duration || 1)}
                    onChange={(event) =>
                        seek(Number(event.target.value))
                    }
                    disabled={!duration}
                    aria-label="Posición de reproducción"
                />

                <span className="music-player-time">
                    {formatTime(duration)}
                </span>

                <div className="music-player-volume">
                    {volume === 0 ? (
                        <VolumeX aria-hidden="true" />
                    ) : (
                        <Volume2 aria-hidden="true" />
                    )}

                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={(event) =>
                            changeVolume(Number(event.target.value))
                        }
                        aria-label="Volumen"
                    />
                </div>
            </div>

            {error && (
                <p className="music-player-error" role="alert">
                    {error}
                </p>
            )}
        </section>
    );
}

export default MusicPlayer;