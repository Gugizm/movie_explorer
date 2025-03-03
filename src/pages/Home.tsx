import { useEffect, useState, useRef } from "react";
import { fetchTrendingMovies, searchMovies } from "../api/movies";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const scrollRef = useRef<number>(0);
  const moviesQueryRef = useRef<string>(""); // Persist search query

  const loadMovies = async (reset = false) => {
    scrollRef.current = window.scrollY;
    setLoading(true);
    try {
      let data: any[] = [];
      if (isSearching && moviesQueryRef.current.trim()) {
        data = await searchMovies(moviesQueryRef.current, page);
        console.log(
          "Loading search results for:",
          moviesQueryRef.current,
          "Page:",
          page
        );
      } else {
        data = await fetchTrendingMovies(page);
        console.log("Loading trending movies, Page:", page);
      }
      setMovies((prev) => {
        const newMovies = reset ? data : [...prev, ...data];
        const uniqueMoviesMap = new Map<number, any>();
        newMovies.forEach((movie) => uniqueMoviesMap.set(movie.id, movie));
        const uniqueMovies = Array.from(uniqueMoviesMap.values());
        console.log(
          "Current movie IDs:",
          uniqueMovies.map((m) => m.id)
        );
        return uniqueMovies;
      });
    } catch (err) {
      setError("Failed to load movies.");
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollRef.current);
      });
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const page1 = await fetchTrendingMovies(1);
        const page2 = await fetchTrendingMovies(2);
        const combined = [...page1, ...page2];
        const uniqueMoviesMap = new Map<number, any>();
        combined.forEach((movie) => uniqueMoviesMap.set(movie.id, movie));
        const uniqueMovies = Array.from(uniqueMoviesMap.values());
        setMovies(uniqueMovies);
        setPage(3);
      } catch (err) {
        setError("Failed to load trending movies.");
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, []);

  const handleSearch = async (query: string) => {
    console.log("handleSearch called with query:", query); // Debug
    moviesQueryRef.current = query; // Update persisted query
    setLoading(true);
    try {
      if (!query.trim()) {
        setIsSearching(false);
        setPage(1);
        const page1 = await fetchTrendingMovies(1);
        const page2 = await fetchTrendingMovies(2);
        const combined = [...page1, ...page2];
        const uniqueMoviesMap = new Map<number, any>();
        combined.forEach((movie) => uniqueMoviesMap.set(movie.id, movie));
        setMovies(Array.from(uniqueMoviesMap.values()));
        setPage(3);
      } else {
        setIsSearching(true);
        setPage(1);
        const page1 = await searchMovies(query, 1);
        const page2 = await searchMovies(query, 2);
        const combined = [...page1, ...page2];
        const uniqueMoviesMap = new Map<number, any>();
        combined.forEach((movie) => uniqueMoviesMap.set(movie.id, movie));
        setMovies(Array.from(uniqueMoviesMap.values()));
        setPage(3);
      }
    } catch (err) {
      setError("Failed to load movies.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading) {
      loadMovies();
      setPage((prev) => prev + 1);
    }
  };

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
      <SearchBar onSearch={handleSearch} placeholder="Search for a movie..." />
      {loading && movies.length === 0 && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-center text-gray-500">No movies found.</p>
      )}
      {movies.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
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
        </>
      )}
    </div>
  );
}
