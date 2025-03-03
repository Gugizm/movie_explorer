import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">No favorites added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
