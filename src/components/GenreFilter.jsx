
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import "./GenreFilter.css";

function GenreFilter({
    genres,
    selectedGenre,
    onGenreChange,
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const buttonRef = useRef(null);

    const activeGenre = genres.find(
        (genre) => String(genre.idGenero) === String(selectedGenre)
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "pointerdown",
                handleClickOutside
            );
        };
    }, []);

    useEffect(() => {
        if (disabled) {
            setIsOpen(false);
        }
    }, [disabled]);

    const selectGenre = (genreId) => {
        onGenreChange(genreId);
        setIsOpen(false);
        buttonRef.current?.focus();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Escape" && isOpen) {
            setIsOpen(false);
            buttonRef.current?.focus();
        }
    };

    return (
        <div
            className="genre-filter"
            ref={containerRef}
            onKeyDown={handleKeyDown}
        >
            <span
                className="genre-filter-label"
                id="genre-filter-label"
            >
                Filtrar por género
            </span>

            <button
                ref={buttonRef}
                type="button"
                className="genre-filter-button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                aria-expanded={isOpen}
                aria-controls="genre-options"
                aria-labelledby="genre-filter-label genre-filter-value"
            >
                <span id="genre-filter-value">
                    {activeGenre?.tipo || "Todos los géneros"}
                </span>

                <ChevronDown
                    aria-hidden="true"
                    className={isOpen ? "genre-filter-arrow-open" : ""}
                />
            </button>

            {isOpen && (
                <div
                    className="genre-filter-options"
                    id="genre-options"
                    aria-label="Opciones de género"
                >
                    <button
                        type="button"
                        className="genre-filter-option"
                        aria-pressed={selectedGenre === ""}
                        onClick={() => selectGenre("")}
                    >
                        Todos los géneros
                    </button>

                    {genres.map((genre) => (
                        <button
                            key={genre.idGenero}
                            type="button"
                            className="genre-filter-option"
                            aria-pressed={
                                String(selectedGenre) === String(genre.idGenero)
                            }
                            onClick={() =>
                                selectGenre(String(genre.idGenero))
                            }
                        >
                            {genre.tipo}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default GenreFilter;
