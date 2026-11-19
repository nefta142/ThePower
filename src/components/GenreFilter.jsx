import "./GenreFilter.css";

function GenreFilter({
    genres,
    selectedGenre,
    onGenreChange,
    disabled = false
}) {
    return (
        <section
            className="genre-filter"
            aria-labelledby="genre-filter-title"
        >
            <div className="genre-filter-header">
                <h2
                    id="genre-filter-title"
                    className="genre-filter-title"
                >
                    Géneros
                </h2>
            </div>

            <div
                className="genre-filter-list"
                role="group"
                aria-label="Filtrar canciones por género"
            >
                <button
                    type="button"
                    className={`genre-filter-item ${
                        selectedGenre === "" ? "selected" : ""
                    }`}
                    onClick={() => onGenreChange("")}
                    aria-pressed={selectedGenre === ""}
                    disabled={disabled}
                >
                    Todos
                </button>

                {genres.map((genre) => {
                    const isSelected =
                        String(selectedGenre) === String(genre.idGenero);

                    return (
                        <button
                            key={genre.idGenero}
                            type="button"
                            className={`genre-filter-item ${
                                isSelected ? "selected" : ""
                            }`}
                            onClick={() =>
                                onGenreChange(String(genre.idGenero))
                            }
                            aria-pressed={isSelected}
                            disabled={disabled}
                        >
                            {genre.tipo}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}

export default GenreFilter;
