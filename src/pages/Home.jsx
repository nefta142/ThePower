import Header from "../components/Header"
import SongCard from "../components/SongCard";
import "./Home.css"
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import FeedBack from "../components/FeedBack";
import { getSongs } from "../services/songService";

function Home() {

    const location = useLocation();
    const navigate = useNavigate();

    const [message, setMessage] = useState(
        () => location.state?.message || ""
    );

    const closeMessage = () => {
        setMessage("");
        navigate("/", { replace: true, state: null });
    };

    const [songs, setSongs] = useState([]);
    const [loadingSongs, setLoadingSongs] = useState(true);
    const [songsError, setSongsError] = useState("");

    useEffect(() => {
        let active = true;

        const loadSongs = async () => {
            try {
                setLoadingSongs(true);
                setSongsError("");

                const data = await getSongs();

                if (active) {
                    setSongs(data);
                }
            } catch (error) {
                if (active) {
                    setSongsError(
                        error.message || "No se pudieron cargar las canciones."
                    );
                }
            } finally {
                if (active) {
                    setLoadingSongs(false);
                }
            }
        };

        loadSongs();

        return () => {
            active = false;
        };
    }, []);


    return (
        <main className="home">
            <Header />

            <FeedBack
                message={message}
                onClose={closeMessage} />

            <section aria-labelledby="home-title">
                <h1 id="home-title">Descubre tu música</h1>
                <p>Escucha tus canciones favoritas en The Power.</p>
            </section>

            <section aria-labelledby="recommended-title">
                <h2 id="recommended-title">Recomendado para ti</h2>
                {loadingSongs && (
                    <p role="status">Cargando canciones...</p>
                )}

                {songsError && (
                    <p className="login-error" role="alert">
                        {songsError}
                    </p>
                )}

                {!loadingSongs && !songsError && songs.length === 0 && (
                    <p>No hay canciones disponibles todavía.</p>
                )}

                {!loadingSongs && !songsError && songs.length > 0 && (
                    <div className="songs-grid">
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

            <section aria-labelledby="popular-title">
                <h2 id="popular-title">Lo más escuchado</h2>
            </section>
        </main>
    );
}

export default Home