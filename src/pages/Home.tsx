import { useEffect, useState, useRef } from "react";
import { fetchTrendingMovies, searchMovies } from "../api/movies";
import MovieCard from "../components/MovieCard";
import { Movie } from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const scrollRef = useRef(0);
  const moviesQueryRef = useRef("");

  const loadMovies = async (reset = false) => {
    scrollRef.current = window.scrollY;
    setLoading(true);
    try {
      const data =
        isSearching && moviesQueryRef.current.trim()
          ? await searchMovies(moviesQueryRef.current, page)
          : await fetchTrendingMovies(page);
      const validData = data.filter(
        (movie: Movie) => movie.poster_path && movie.poster_path.trim()
      );
      setMovies((prev) => {
        const newMovies = reset ? validData : [...prev, ...validData];
        const uniqueMoviesMap = new Map();
        newMovies.forEach((movie: Movie) =>
          uniqueMoviesMap.set(movie.id, movie)
        );
        return Array.from(uniqueMoviesMap.values());
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to load movies: ${err.message}`);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
      requestAnimationFrame(() => window.scrollTo(0, scrollRef.current));
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTrendingMovies(1)
      .then((page1) => fetchTrendingMovies(2).then((page2) => [page1, page2]))
      .then(([page1, page2]) => {
        const combined = [...page1, ...page2].filter(
          (movie) => movie.poster_path && movie.poster_path.trim()
        );
        const uniqueMoviesMap = new Map();
        combined.forEach((movie) => uniqueMoviesMap.set(movie.id, movie));
        setMovies(Array.from(uniqueMoviesMap.values()));
        setPage(3);
      })
      .catch((err) =>
        setError(`Failed to load trending movies: ${err.message}`)
      )
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async (query: string) => {
    moviesQueryRef.current = query;
    setLoading(true);
    try {
      if (!query.trim()) {
        setLoading(true);
        const page1 = await fetchTrendingMovies(1);
        const page2 = await fetchTrendingMovies(2);
        const combined = [...page1, ...page2].filter(
          (movie) => movie.poster_path && movie.poster_path.trim()
        );
        const uniqueMoviesMap = new Map();
        combined.forEach((movie) => uniqueMoviesMap.set(movie.id, movie));
        setMovies(Array.from(uniqueMoviesMap.values()));
        setPage(3);
        setIsSearching(false);
      } else {
        setIsSearching(true);
        setPage(1);
        const data = await searchMovies(query, 1);
        const validData = data.filter(
          (movie: Movie) => movie.poster_path && movie.poster_path.trim()
        );
        setMovies(validData);
        setPage(2);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(`Failed to load movies: ${err.message}`);
      } else {
        setError("An unknown error occurred");
      }
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
    <div className="container mx-auto px-4 py-6 bg-gray-900 text-gray-100">
      <SearchBar onSearch={handleSearch} placeholder="Search for a movie..." />
      {loading && movies.length === 0 && <LoadingSpinner />}
      {error && <p className="text-red-400 text-center">{error}</p>}
      {!loading && !error && movies.length === 0 && (
        <p className="text-center text-gray-400">No movies found.</p>
      )}
      {movies.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 place-items-center">
            {movies.map((movie: Movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          <div className="mt-6 text-center">
            {loading ? (
              <div className="inline-block">
                <LoadingSpinner />
              </div>
            ) : (
              <button onClick={handleLoadMore}>Load More</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
