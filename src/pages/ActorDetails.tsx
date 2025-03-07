import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import { Actor } from "../types/Actor";
import { Movie } from "../types/Movie";
import { fetchActorDetails, fetchActorMovies } from "../api/api";
import { config } from "../constants/config";

export default function ActorDetails() {
  const { id } = useParams<{ id: string }>();
  const [actor, setActor] = useState<Actor | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadActorData = async () => {
      try {
        const actorData = await fetchActorDetails(id!);
        const movieData = await fetchActorMovies(id!);
        setActor(actorData);
        setMovies(movieData.filter((m) => m.poster_path));
      } catch (err) {
        setError("Failed to load actor details.");
      } finally {
        setLoading(false);
      }
    };
    loadActorData();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-400 text-center">{error}</p>;
  if (!actor)
    return <p className="text-gray-400 text-center">Actor not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-700 text-gray-100 rounded hover:bg-gray-600 transition"
      >
        Back
      </button>
      <div className="flex flex-col md:flex-row items-start">
        {actor.profile_path && (
          <img
            src={`${config.IMAGE_BASE_URL}/w300${actor.profile_path}`}
            alt={actor.name}
            className="w-full md:w-1/3 h-auto rounded object-cover mb-4 md:mb-0 md:mr-6"
          />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-100">{actor.name}</h1>
          <p className="mt-2 text-gray-400">
            Birthday: {actor.birthday || "N/A"}
          </p>
          <p className="mt-2 text-gray-400">
            Nationality: {actor.place_of_birth || "N/A"}
          </p>
          <p className="mt-2 text-gray-300">
            {actor.biography || "No biography available."}
          </p>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-200 mt-6">Known For:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
