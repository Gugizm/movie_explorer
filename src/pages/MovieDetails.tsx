import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMovieDetails } from "../api/api";
import { useFavorites } from "../context/FavoritesContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { Movie } from "../types/Movie";
import { HeartFilledSVG, HeartOutlineSVG } from "../utils/svgs";
import { config } from "../constants/config";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addFavorite, removeFavorite, favorites } = useFavorites();
  const isFavorite = favorites.some((fav) => fav.id === Number(id));

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const data = await fetchMovieDetails(id!);
        setMovie({
          ...data,
          cast: data.credits?.cast || [],
        });
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
    } else if (movie) {
      addFavorite(movie);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-400 text-center">{error}</p>;
  if (!movie)
    return <p className="text-gray-400 text-center">Movie not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-700 text-gray-100 rounded hover:bg-gray-600 transition"
      >
        Back
      </button>
      <div className="flex flex-col md:flex-row items-start bg-gray-800 rounded-lg p-6">
        <img
          src={`${config.IMAGE_BASE_URL}/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full md:w-1/3 h-auto rounded object-cover mb-4 md:mb-0 md:mr-6"
        />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-100">{movie.title}</h1>
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
          </div>
          <p className="text-gray-300">{movie.overview}</p>
          <p className="mt-2 text-gray-400">
            Release Date: {movie.release_date}
          </p>
          <p className="text-gray-400">Rating: {movie.vote_average}/10</p>
          <p className="mt-2 text-gray-400">
            Genres:{" "}
            {movie.genres
              ?.slice(0, 5)
              .map((g) => g.name)
              .join(", ") || "N/A"}
          </p>
          {movie.cast && movie.cast.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-100">Top Cast:</h3>
              <ul className="text-gray-400">
                {movie.cast.slice(0, 5).map((actor) => (
                  <li
                    key={actor.id}
                    className="cursor-pointer hover:text-gray-300"
                    onClick={() => navigate(`/actor/${actor.id}`)}
                  >
                    {actor.name} as {actor.character}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
