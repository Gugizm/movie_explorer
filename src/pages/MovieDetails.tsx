import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieDetails } from "../api/movies";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded shadow">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full max-w-md mx-auto rounded"
        />
        <h1 className="text-3xl font-bold mt-4">{movie.title}</h1>
        <p className="text-gray-600 mt-2">{movie.overview}</p>
        <p className="mt-2">Release Date: {movie.release_date}</p>
        <p>Rating: {movie.vote_average}/10</p>
      </div>
    </div>
  );
}
