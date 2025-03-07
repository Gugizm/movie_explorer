import { forwardRef } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";
import { Movie } from "../types/Movie";
import { HeartFilledSVG, HeartOutlineSVG } from "../utils/svgs";
import { config } from "../constants/config";

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
      <div ref={ref} className="relative group w-full max-w-xs h-96">
        <img
          src={`${config.IMAGE_BASE_URL}/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-sm text-gray-100 transition-all duration-300 group-hover:h-32 rounded-b-lg">
          <div className="p-1">
            <h3 className="text-base font-semibold truncate">{movie.title}</h3>
            <p className="text-sm">Rating: {movie.vote_average || "N/A"}/10</p>
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
              {isFavorite ? <HeartFilledSVG /> : <HeartOutlineSVG />}
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
