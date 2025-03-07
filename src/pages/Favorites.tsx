import MovieCard from "../components/MovieCard";
import { useFavorites } from "../context/FavoritesContext";
import { Movie } from "../types/Movie";

interface FavoritesProps {
  movies: Movie[];
}

export default function Favorites({ movies }: FavoritesProps) {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto p-4">
      {favorites.length === 0 && movies.length === 0 ? (
        <p className="text-center text-gray-400">
          No favorites or search results yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center max-w-8xl mx-auto">
          {movies.length > 0
            ? movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
            : favorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
        </div>
      )}
    </div>
  );
}
