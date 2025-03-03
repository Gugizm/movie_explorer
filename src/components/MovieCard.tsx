import { forwardRef } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

const MovieCard = forwardRef<HTMLDivElement, { movie: Movie }>(
  ({ movie }, ref) => {
    const { addFavorite, removeFavorite, favorites } = useFavorites();
    const navigate = useNavigate();
    const isFavorite = favorites.some((fav) => fav.id === movie.id);

    const handleDetails = () => navigate(`/movie/${movie.id}`);

    const handleFavoriteToggle = () => {
      if (isFavorite) {
        removeFavorite(movie.id);
      } else {
        addFavorite(movie);
      }
    };

    return (
      <div
        ref={ref}
        className="bg-gray-800 p-4 rounded-lg shadow-xl shadow-gray-500/50 hover:shadow-2xl transition flex flex-col h-full"
      >
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-64 object-cover rounded"
        />
        <h3 className="mt-2 font-semibold text-gray-100 truncate">
          {movie.title}
        </h3>
        <div className="mt-auto flex items-center justify-between pt-2">
          <button
            onClick={handleFavoriteToggle}
            className={`text-2xl ${
              isFavorite
                ? "text-red-400 hover:text-red-500"
                : "text-gray-300 hover:text-gray-400"
            } transition`}
            aria-label={
              isFavorite ? "Remove from Favorites" : "Add to Favorites"
            }
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
          <button
            onClick={handleDetails}
            className="px-4 py-2 rounded bg-gray-700 text-gray-100 hover:bg-gray-600 transition"
          >
            Details
          </button>
        </div>
      </div>
    );
  }
);

export default MovieCard;
