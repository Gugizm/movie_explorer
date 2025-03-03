import { useEffect, useState, useRef, useCallback } from "react";
import { fetchTrendingMovies, searchMovies } from "../api/movies";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if more pages exist
  const observer = useRef<IntersectionObserver | null>(null);

  // Load trending movies initially or when search is cleared
  const loadTrending = useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        const data = await fetchTrendingMovies(reset ? 1 : page);
        setMovies((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(data.length > 0); // Assume no more pages if empty
      } catch (err) {
        setError("Failed to load trending movies.");
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  // Search movies
  const loadSearch = useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        const data = await searchMovies(searchQuery, reset ? 1 : page);
        setMovies((prev) => (reset ? data : [...prev, ...data]));
        setHasMore(data.length > 0);
      } catch (err) {
        setError("Failed to find movies.");
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, page]
  );

  // Initial load of trending movies
  useEffect(() => {
    loadTrending(true);
  }, [loadTrending]);

  // Handle search input changes and form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setPage(1);
      loadTrending(true); // Reset to trending when empty
    } else {
      setPage(1);
      loadSearch(true); // Reset to search results
    }
  };

  // Watch searchQuery to reset when cleared
  useEffect(() => {
    if (!searchQuery.trim()) {
      setPage(1);
      loadTrending(true);
    }
  }, [searchQuery, loadTrending]);

  // Infinite scroll observer
  const lastMovieRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // Load more movies when page changes
  useEffect(() => {
    if (page === 1) return; // Skip initial load
    if (searchQuery.trim()) {
      loadSearch();
    } else {
      loadTrending();
    }
  }, [page, searchQuery, loadSearch, loadTrending]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Movie Explorer</h1>

      <form onSubmit={handleSearch} className="mb-8 flex justify-center">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a movie..."
          className="w-full max-w-md p-2 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition"
        >
          Search
        </button>
      </form>

      {loading && page === 1 && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-center text-gray-500">No movies found.</p>
      )}
      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie, index) => {
            if (index === movies.length - 1) {
              return (
                <MovieCard key={movie.id} movie={movie} ref={lastMovieRef} />
              );
            }
            return <MovieCard key={movie.id} movie={movie} />;
          })}
        </div>
      )}
      {loading && page > 1 && (
        <div className="mt-4 text-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
