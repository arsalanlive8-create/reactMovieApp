function GenreFilter({ genres, selectedGenre, onChange }) {
    return (
        <select className="genre-filter" value={selectedGenre} onChange={onChange}>
            <option value="">All Genres</option>

            {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                    {genre.name}
                </option>
            ))}
        </select>
    );
}

export default GenreFilter;