import { forwardRef } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
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
      <div ref={ref} className="relative group w-64 h-96">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-sm text-gray-100 transition-all duration-300 group-hover:h-32 rounded-b-lg">
          <div className="p-1">
            <h3 className="text-base font-semibold truncate">{movie.title}</h3>
            <p className="text-sm">Rating: {movie.vote_average}/10</p>
          </div>
          <div className="flex justify-between p-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
              {isFavorite ? (
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
                </svg>
              )}
            </button>
            <button
              onClick={handleDetails}
              className="px-4 py-2 rounded bg-gray-700 text-gray-100 hover:bg-gray-600 transition"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    );
  }
);

export default MovieCard;
