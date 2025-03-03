import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../api/movies";
import { useFavorites } from "../context/FavoritesContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, favorites } = useFavorites();
  const isFavorite = favorites.some((fav) => fav.id === Number(id));

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await fetchMovieDetails(id!);
        setMovie(data);
      } catch (err) {
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };
    loadMovie();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(Number(id));
    } else {
      addFavorite({
        id: Number(id),
        title: movie.title,
        poster_path: movie.poster_path,
      });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div className="container mx-auto pt-2 min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl shadow-gray-500/50 flex flex-col md:flex-row items-start w-full max-w-4xl">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/2 h-auto max-h-[600px] rounded object-cover"
        />
        <div className="md:ml-6 mt-4 md:mt-0 flex flex-col items-start w-full md:w-1/2">
          <div className="flex justify-between w-full mb-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-700 text-gray-100 rounded hover:bg-gray-600 transition"
            >
              Back
            </button>
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
          </div>
          <h1 className="text-2xl font-bold text-gray-100">{movie.title}</h1>
          <p className="text-gray-300 mt-2">{movie.overview}</p>
          <p className="mt-2 text-gray-400">
            Release Date: {movie.release_date}
          </p>
          <p className="text-gray-400">Rating: {movie.vote_average}/10</p>
        </div>
      </div>
    </div>
  );
}
