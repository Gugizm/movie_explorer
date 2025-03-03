import { useEffect, useState, useRef } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";

export default function Favorites() {
  const { favorites } = useFavorites();
  const [displayedMovies, setDisplayedMovies] = useState(30);
  const [filteredFavorites, setFilteredFavorites] = useState(favorites);
  const scrollRef = useRef<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredFavorites(favorites); // Sync with context
  }, [favorites]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredFavorites(favorites); // Reset to all favorites
    } else {
      setFilteredFavorites(
        favorites.filter((movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  };

  const handleLoadMore = () => {
    scrollRef.current = window.scrollY;
    setDisplayedMovies((prev) => prev + 30);
    requestAnimationFrame(() => {
      window.scrollTo(0, scrollRef.current);
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        handleLoadMore();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleFavorites = filteredFavorites.slice(0, displayedMovies);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Favorites</h1>
      <SearchBar onSearch={handleSearch} placeholder="Search favorites..." />
      {filteredFavorites.length === 0 ? (
        <p className="text-center text-gray-500">No favorites added yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleFavorites.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          {displayedMovies < filteredFavorites.length && (
            <div className="mt-6 text-center">
              <button
                onClick={handleLoadMore}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
