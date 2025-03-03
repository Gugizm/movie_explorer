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

    const handleDetails = () => {
      navigate(`/movie/${movie.id}`);
    };

    return (
      <div
        ref={ref}
        className="bg-white p-4 rounded shadow hover:shadow-lg transition flex flex-col h-full"
      >
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-64 object-cover rounded"
        />
        <h3 className="mt-2 font-semibold truncate">{movie.title}</h3>
        <div className="mt-auto flex space-x-2 pt-2">
          <button
            onClick={() =>
              isFavorite ? removeFavorite(movie.id) : addFavorite(movie)
            }
            className={`flex-1 px-4 py-2 rounded text-white ${
              isFavorite
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } transition`}
          >
            {isFavorite ? "Remove Favorite" : "Add to Favorites"}
          </button>
          <button
            onClick={handleDetails}
            className="flex-1 px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
          >
            Details
          </button>
        </div>
      </div>
    );
  }
);

export default MovieCard;
