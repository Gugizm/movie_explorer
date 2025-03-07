import { useEffect, useCallback, useState } from "react";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieSlider from "../components/MovieSlider";
import { Movie } from "../types/Movie";
import { fetchTrendingMovies } from "../api/api";

interface HomeProps {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export default function Home({
  movies,
  loading,
  error,
  page,
  setPage,
  setMovies,
}: HomeProps) {
  const [sliderMovies, setSliderMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const loadSliderMovies = async () => {
      try {
        const data = await fetchTrendingMovies(1);
        setSliderMovies(data.filter((m) => m.poster_path).slice(0, 20));
      } catch (err) {
        console.error("Failed to load slider movies:", err);
      }
    };
    loadSliderMovies();
  }, []);

  const loadMore = useCallback(async () => {
    if (loading) return;
    try {
      const data = await fetchTrendingMovies(page);
      const filteredData = data.filter((m) => m.poster_path);
      setMovies((prev) => [...prev, ...filteredData]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to load more movies:", err);
    }
  }, [loading, page, setMovies, setPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading
      ) {
        loadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadMore]);

  return (
    <div className="container mx-auto px-4 py-6">
      <MovieSlider movies={sliderMovies} />
      {loading && !movies.length && <LoadingSpinner />}
      {error && <p className="text-red-400 text-center">{error}</p>}
      {!loading && !movies.length && (
        <p className="text-center text-gray-400">No movies found.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {loading && movies.length > 0 && (
        <div className="text-center mt-6">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
