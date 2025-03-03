import { useEffect, useState, useRef } from "react";
import { useFavorites } from "../context/FavoritesContext";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";

export default function Favorites() {
  const { favorites } = useFavorites();
  const [displayedMovies, setDisplayedMovies] = useState(30);
  const [filteredFavorites, setFilteredFavorites] = useState(favorites);
  const scrollRef = useRef(0);

  useEffect(() => {
    setFilteredFavorites(favorites);
  }, [favorites]);

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredFavorites(favorites);
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
    requestAnimationFrame(() => window.scrollTo(0, scrollRef.current));
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
      <SearchBar onSearch={handleSearch} placeholder="Search favorites..." />
      {filteredFavorites.length === 0 ? (
        <p className="text-center text-gray-400">No favorites added yet.</p>
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
                className="bg-gray-700 text-gray-100 px-4 py-2 rounded hover:bg-gray-600 transition"
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
