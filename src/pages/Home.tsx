import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "../api/movies";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const data = await fetchTrendingMovies();
        setMovies(data);
      } catch (err) {
        setError("Failed to load movies.");
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Trending Movies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
