import { useEffect, useState, useRef } from "react";
import { fetchTrendingMovies, searchMovies } from "../api/movies";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef<number>(0);

  const loadMovies = async (reset = false) => {
    scrollRef.current = window.scrollY;
    setLoading(true);
    try {
      let data: any[] = [];
      if (isSearching && searchQuery.trim()) {
        data = await searchMovies(searchQuery, page);
      } else {
        data = await fetchTrendingMovies(page);
      }
      setMovies((prev) => (reset ? data : [...prev, ...data]));
    } catch (err) {
      setError("Failed to load movies.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollRef.current);
      });
    }
  };

  // Initial load: 2 pages (40 movies)
  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const page1 = await fetchTrendingMovies(1);
        const page2 = await fetchTrendingMovies(2);
        setMovies([...page1, ...page2]);
        setPage(3);
      } catch (err) {
        setError("Failed to load trending movies.");
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, []);

  // Handle search and reset
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setIsSearching(false);
      setPage(1);
      const page1 = await fetchTrendingMovies(1);
      const page2 = await fetchTrendingMovies(2);
      setMovies([...page1, ...page2]);
      setPage(3);
    } else {
      setIsSearching(true);
      setPage(1);
      const page1 = await searchMovies(searchQuery, 1);
      const page2 = await searchMovies(searchQuery, 2);
      setMovies([...page1, ...page2]);
      setPage(3);
    }
  };

  // Load more on scroll or button click
  const handleLoadMore = () => {
    if (!loading) {
      loadMovies();
      setPage((prev) => prev + 1);
    }
  };

  // Scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading
      ) {
        handleLoadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

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

      {/* Initial loading or error */}
      {loading && movies.length === 0 && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-center text-gray-500">No movies found.</p>
      )}

      {/* Movie grid */}
      {!loading && !error && movies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {/* Load more section */}
      {movies.length > 0 && (
        <div className="mt-6 text-center">
          {loading ? (
            <div className="inline-block">
              <LoadingSpinner />
              <p className="text-gray-500 mt-2">Loading more movies...</p>
            </div>
          ) : (
            <button
              onClick={handleLoadMore}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  );
}
