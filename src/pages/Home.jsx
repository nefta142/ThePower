
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import SongCard from "../components/SongCard";
import FeedBack from "../components/FeedBack";
import SearchBar from "../components/SearchBar";

import { getSongs } from "../services/songService";

import "./Home.css";

function Home() {
    const location = useLocation();
    const navigate = useNavigate();

    const [message, setMessage] = useState(
        () => location.state?.message || ""
    );

    const [songs, setSongs] = useState([]);
    const [loadingSongs, setLoadingSongs] = useState(true);
    const [songsError, setSongsError] = useState("");

    const [searchText, setSearchText] = useState("");

    const closeMessage = () => {
        setMessage("");
        navigate("/", {
            replace: true,
            state: null
        });
    };


    useEffect(() => {
        let active = true;

        const loadSongs = async () => {
            try {
                setLoadingSongs(true);
                setSongsError("");

                const data = await getSongs(searchText);

                if (active) {
                    setSongs(data);
                }

            } catch (error) {
                if (active) {
                    setSongsError(
                        error.message || "No se pudieron cargar las canciones."
                    );
                    setSongs([]);
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
    }, [searchText]);

    return (
        <main className="home">
            <Header />

            <FeedBack
                message={message}
                onClose={closeMessage}
            />

            <section
                className="home-welcome"
                aria-labelledby="home-title"
            >
                <h1 id="home-title">
                    Descubre tu música
                </h1>

                <p>
                    Escucha tus canciones favoritas en The Power.
                </p>
            </section>

            <SearchBar
                onSearch={(text) => setSearchText(text)}
                onClear={() => setSearchText("")}
            />

            <section
                className="home-section"
                aria-labelledby="recommended-title"
            >
                <h2 id="recommended-title">
                    {searchText
                        ? "Resultados de búsqueda"
                        : "Canciones disponibles"}
                </h2>

                {loadingSongs && (
                    <p className="search-loading" role="status">
                        {searchText
                            ? "Buscando canciones..."
                            : "Cargando canciones..."}
                    </p>
                )}

                {songsError && (
                    <p className="login-error" role="alert">
                        {songsError}
                    </p>
                )}

                {!loadingSongs && !songsError && (
                    <>
                        <p
                            className="search-results-count"
                            role="status"
                        >
                            {songs.length}{" "}
                            {songs.length === 1
                                ? "canción encontrada"
                                : "canciones encontradas"}
                        </p>

                        {songs.length === 0 ? (
                            <p className="search-empty">
                                {searchText
                                    ? `No se encontraron canciones para "${searchText}".`
                                    : "Todavía no hay canciones disponibles."}
                            </p>
                        ) : (
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
                    </>
                )}
            </section>

            <section
                className="home-section"
                aria-labelledby="popular-title"
            >
                <h2 id="popular-title">
                    Lo más escuchado
                </h2>
            </section>
        </main>
    );
}

export default Home;
