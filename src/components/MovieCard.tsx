import { useFavorites } from "../context/FavoritesContext";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const { addFavorite, removeFavorite, favorites } = useFavorites();
  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
        className="w-full h-64 object-cover rounded"
      />
      <h3 className="mt-2 font-semibold">{movie.title}</h3>
      <button
        onClick={() =>
          isFavorite ? removeFavorite(movie.id) : addFavorite(movie)
        }
        className={`mt-2 px-4 py-2 rounded ${
          isFavorite ? "bg-red-500" : "bg-blue-500"
        } text-white`}
      >
        {isFavorite ? "Remove Favorite" : "Add to Favorites"}
      </button>
    </div>
  );
}
