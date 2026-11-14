
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Header from "../components/Header";
import SongCard from "../components/SongCard";
import FeedBack from "../components/FeedBack";
import SearchBar from "../components/SearchBar";
import GenreFilter from "../components/GenreFilter";

import { getSongs } from "../services/songService";
import { getGenres } from "../services/genreService";

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
    const [songsRetry, setSongsRetry] = useState(0);

    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [genresError, setGenresError] = useState("");
    const [genresRetry, setGenresRetry] = useState(0);

    const [searchText, setSearchText] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [filterMessage, setFilterMessage] = useState("");

    const closeMessage = () => {
        setMessage("");
        navigate("/", {
            replace: true,
            state: null
        });
    };


    useEffect(() => {
        let active = true;

        const loadGenres = async () => {
            try {
                setLoadingGenres(true);
                setGenresError("");

                const data = await getGenres();

                if (active) {
                    setGenres(data);
                }
            } catch (error) {
                if (active) {
                    setGenresError(
                        error.message || "No se pudieron cargar los géneros."
                    );
                    setGenres([]);
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
    }, [genresRetry]);

    useEffect(() => {
        let active = true;

        const loadSongs = async () => {
            try {
                setLoadingSongs(true);
                setSongsError("");

                const data = await getSongs(
                    searchText,
                    selectedGenre
                );

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
    }, [searchText, selectedGenre, songsRetry]);

    const activeGenre = genres.find(
        (genre) => String(genre.idGenero) === selectedGenre
    );

    const hasActiveFilters = Boolean(searchText || selectedGenre);


    const handleSearch = (text) => {
        setSearchText(text);
        setFilterMessage(`Búsqueda aplicada: "${text}".`);
    };

    const handleClearSearch = () => {
        setSearchText("");
        setFilterMessage("Filtro de búsqueda eliminado.");
    };

    const handleGenreChange = (genreId) => {
        setSelectedGenre(genreId);

        if (!genreId) {
            setFilterMessage("Filtro de género eliminado.");
            return;
        }

        const genre = genres.find(
            (item) => String(item.idGenero) === String(genreId)
        );

        setFilterMessage(
            `Filtro de género aplicado: ${genre?.tipo || "Seleccionado"}.`
        );
    };

    const clearAllFilters = () => {
        setSearchText("");
        setSelectedGenre("");
        setFilterMessage("Todos los filtros se han eliminado.");
    };

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
                searchText={searchText}
                onSearch={handleSearch}
                onClear={handleClearSearch}
            />

            <GenreFilter
                genres={genres}
                selectedGenre={selectedGenre}
                onGenreChange={handleGenreChange}
                disabled={loadingGenres || Boolean(genresError)}
            />

            {loadingGenres && (
                <p className="search-loading" role="status">
                    Cargando géneros...
                </p>
            )}


            {genresError && (
                <div
                    className="search-error-container"
                    role="alert"
                >
                    <p className="search-filter-error">
                        {genresError}
                    </p>

                    <button
                        type="button"
                        className="search-retry-button"
                        onClick={() => setGenresRetry((previous) => previous + 1)}
                        disabled={loadingGenres}
                    >
                        Reintentar géneros
                    </button>
                </div>
            )}


            {hasActiveFilters && (
                <section
                    className="active-filters"
                    aria-label="Filtros activos"
                >
                    <h2>Filtros aplicados</h2>

                    <div className="active-filters-list">
                        {searchText && (
                            <button
                                type="button"
                                className="active-filter"
                                onClick={handleClearSearch}
                                aria-label={`Eliminar búsqueda ${searchText}`}
                            >
                                Texto: {searchText} ×
                            </button>
                        )}

                        {selectedGenre && (
                            <button
                                type="button"
                                className="active-filter"
                                onClick={() => handleGenreChange("")}
                                aria-label="Eliminar filtro de género"
                            >
                                Género: {activeGenre?.tipo || selectedGenre} ×
                            </button>
                        )}

                        <button
                            type="button"
                            className="clear-all-filters"
                            onClick={clearAllFilters}                        >
                            Limpiar todos
                        </button>
                    </div>
                </section>
            )}

            <div
                className="filter-feedback"
                role="status"
                aria-live="polite"
                aria-atomic="true"
            >
                {filterMessage}
            </div>

            <section
                className="home-section"
                aria-labelledby="recommended-title"
            >
                <h2 id="recommended-title">
                    {hasActiveFilters
                        ? "Resultados de búsqueda"
                        : "Canciones disponibles"}
                </h2>

                {loadingSongs && (
                    <p className="search-loading" role="status">
                        {hasActiveFilters
                            ? "Aplicando filtros..."
                            : "Cargando canciones..."}
                    </p>
                )}

                {songsError && (
                    <div className="search-error-container" role="alert">
                        <p className="search-filter-error">
                            {songsError}
                        </p>

                        <button
                            type="button"
                            className="search-retry-button"
                            onClick={() => setSongsRetry((previous) => previous + 1)}
                            disabled={loadingSongs}
                        >
                            Reintentar
                        </button>
                    </div>
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
                                {hasActiveFilters
                                    ? "No se encontraron canciones con los filtros seleccionados."
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
