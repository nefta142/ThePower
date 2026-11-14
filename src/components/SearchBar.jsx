import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

import "./SearchBar.css";

function SearchBar({ onSearch, onClear }) {
    const [searchText, setSearchText] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        const text = searchText.trim();

        if (!text) {
            setError("Introduce el nombre de una canción.");
            return;
        }

        if (text.length > 100) {
            setError("La búsqueda no puede superar 100 caracteres.");
            return;
        }

        setError("");
        onSearch(text);
    };

    const handleClear = () => {
        setSearchText("");
        setError("");
        onClear();
    };

    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleFocusSearch = () => {
            searchInputRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            searchInputRef.current?.focus({
                preventScroll: true
            });
        };

        window.addEventListener("focus-song-search", handleFocusSearch);

        return () => {
            window.removeEventListener("focus-song-search", handleFocusSearch);
        };
    }, []);

    return (
        <form
            className="search-form"
            role="search"
            onSubmit={handleSubmit}
            noValidate
        >
            <label htmlFor="song-search">
                Buscar canciones
            </label>

            <div className="search-controls">
                <input
                    id="song-search"
                    type="search"
                    placeholder="Título de la canción..."
                    value={searchText}
                    maxLength={100}
                    onChange={(e) => {
                        setSearchText(e.target.value);
                        setError("");
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "search-error" : undefined}
                    ref={searchInputRef}
                />

                {searchText && (
                    <button
                        type="button"
                        className="search-clear"
                        onClick={handleClear}
                        aria-label="Limpiar búsqueda"
                    >
                        <X aria-hidden="true" />
                    </button>
                )}

                <button
                    type="submit"
                    className="search-submit"
                    aria-label="Buscar canciones"
                >
                    <Search aria-hidden="true" />
                    <span>Buscar</span>
                </button>
            </div>

            {error && (
                <p
                    id="search-error"
                    className="search-error"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </form>
    );
}

export default SearchBar;
