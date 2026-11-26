import {
    createContext,
    useContext,
    useRef,
    useState
} from "react";

const PlayerContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

function getAudioUrl(audio) {
    if (!audio) return "";

    if (
        audio.startsWith("http://") ||
        audio.startsWith("https://")
    ) {
        return audio;
    }

    return `${API_URL}/${audio.replace(/^\/+/, "")}`;
}

export function PlayerProvider({ children }) {
    const audioRef = useRef(null);

    const [currentSong, setCurrentSong] = useState(null);
    const [playlist, setPlaylist] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [error, setError] = useState("");

    const playAudio = async (song) => {
        if (!song?.audio || !audioRef.current) {
            setError("Esta canción no tiene audio disponible.");
            return;
        }

        const audio = audioRef.current;

        try {
            setError("");
            audio.pause();
            audio.src = getAudioUrl(song.audio);
            audio.currentTime = 0;
            audio.volume = volume;

            setCurrentSong(song);
            setCurrentTime(0);
            setDuration(0);

            await audio.play();
        } catch {
            setIsPlaying(false);
            setError("No se pudo reproducir la canción.");
        }
    };

    const playSong = (song, songs = [song]) => {
        const index = songs.findIndex(
            (item) => item.idCancion === song.idCancion
        );

        setPlaylist(songs);
        setCurrentIndex(index);

        playAudio(song);
    };

    const togglePlay = async () => {
        const audio = audioRef.current;

        if (!audio || !currentSong) return;

        if (audio.paused) {
            try {
                setError("");
                await audio.play();
            } catch {
                setError("No se pudo continuar la reproducción.");
            }
        } else {
            audio.pause();
        }
    };

    const nextSong = () => {
        if (currentIndex < playlist.length - 1) {
            const nextIndex = currentIndex + 1;

            setCurrentIndex(nextIndex);
            playAudio(playlist[nextIndex]);
        }
    };

    const previousSong = () => {
        const audio = audioRef.current;

        if (!audio) return;

        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }

        if (currentIndex > 0) {
            const previousIndex = currentIndex - 1;

            setCurrentIndex(previousIndex);
            playAudio(playlist[previousIndex]);
        } else {
            audio.currentTime = 0;
        }
    };

    const seek = (time) => {
        const audio = audioRef.current;

        if (!audio || !Number.isFinite(audio.duration)) return;

        audio.currentTime = Math.max(
            0,
            Math.min(time, audio.duration)
        );
        setCurrentTime(audio.currentTime);
    };

    const changeVolume = (value) => {
        const newVolume = Math.max(0, Math.min(1, value));

        setVolume(newVolume);

        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);

        if (currentIndex < playlist.length - 1) {
            nextSong();
        }
    };

    return (
        <PlayerContext.Provider
            value={{
                currentSong,
                playlist,
                currentIndex,
                isPlaying,
                currentTime,
                duration,
                volume,
                error,
                playSong,
                togglePlay,
                nextSong,
                previousSong,
                seek,
                changeVolume
            }}
        >
            {children}

            <audio
                ref={audioRef}
                preload="metadata"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(event) =>
                    setCurrentTime(event.currentTarget.currentTime)
                }
                onLoadedMetadata={(event) =>
                    setDuration(
                        Number.isFinite(event.currentTarget.duration)
                            ? event.currentTarget.duration
                            : 0
                    )
                }
                onEnded={handleEnded}
                onError={() => {
                    if (audioRef.current?.src) {
                        setIsPlaying(false);
                        setError("No se pudo cargar el archivo de audio.");
                    }
                }}
            />
        </PlayerContext.Provider>
    );
}

export function usePlayer() {
    const context = useContext(PlayerContext);

    if (!context) {
        throw new Error(
            "usePlayer debe utilizarse dentro de PlayerProvider."
        );
    }

    return context;
}
