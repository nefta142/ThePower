import "./GenreFilter.css";

function GenreFilter({
    genres,
    selectedGenre,
    onGenreChange,
    disabled = false
}) {
    return (
        <div className="genre-filter">
            <label htmlFor="genre-filter-select">
                Filtrar por género
            </label>

            <select
                id="genre-filter-select"
                value={selectedGenre}
                onChange={(e) => onGenreChange(e.target.value)}
                disabled={disabled}
            >
                <option value="">Todos los géneros</option>

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
    );
}

export default GenreFilter;
