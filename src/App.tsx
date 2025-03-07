import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";
import Actors from "./pages/Actors";
import ActorDetails from "./pages/ActorDetails";
import { Movie } from "./types/Movie";
import { Actor } from "./types/Actor";
import { fetchTrendingMovies, searchMovies, searchActors } from "./api/api";
import { FavoritesProvider, useFavorites } from "./context/FavoritesContext";

function AppContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [moviePage, setMoviePage] = useState(1);
  const [actorPage, setActorPage] = useState(1);
  const [query, setQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const handleSearch = async (searchQuery: string) => {
    console.log(
      "handleSearch called with query:",
      searchQuery,
      "from path:",
      location.pathname
    );
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setActors([]);
      if (location.pathname === "/" || location.pathname === "/favorites") {
        setLoading(true);
        try {
          if (location.pathname === "/favorites") {
            setMovies(favorites); // Reset to all favorites
          } else {
            const page1 = await fetchTrendingMovies(1);
            const page2 = await fetchTrendingMovies(2);
            const combined = [...page1, ...page2].filter(
              (movie) => movie.poster_path
            );
            const uniqueMovies = Array.from(
              new Map(combined.map((m) => [m.id, m])).values()
            );
            setMovies(uniqueMovies);
            setMoviePage(3);
          }
          console.log("Reset movies:", movies);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      }
      return;
    }

    setLoading(true);
    try {
      if (
        location.pathname === "/actors" ||
        location.pathname.startsWith("/actor/")
      ) {
        const actorData = await searchActors(searchQuery, 1);
        setActors(actorData.filter((a) => a.profile_path));
        setActorPage(2);
        setMovies([]);
        console.log("Searched actors:", actorData);
        if (location.pathname.startsWith("/actor/")) {
          navigate("/actors"); // Redirect to Actors page
        }
      } else if (
        location.pathname === "/" ||
        location.pathname === "/favorites" ||
        location.pathname.startsWith("/movie/")
      ) {
        if (location.pathname === "/favorites") {
          const filteredFavorites = favorites.filter((movie) =>
            movie.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setMovies(filteredFavorites);
          console.log("Searched favorites:", filteredFavorites);
        } else {
          const movieData = await searchMovies(searchQuery, 1);
          setMovies(movieData.filter((m) => m.poster_path));
          setMoviePage(2);
          console.log("Searched movies:", movieData);
          if (location.pathname.startsWith("/movie/")) {
            navigate("/");
          }
        }
        setActors([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialMovies = async () => {
      setLoading(true);
      try {
        const page1 = await fetchTrendingMovies(1);
        const page2 = await fetchTrendingMovies(2);
        const combined = [...page1, ...page2].filter(
          (movie) => movie.poster_path
        );
        const uniqueMovies = Array.from(
          new Map(combined.map((m) => [m.id, m])).values()
        );
        setMovies(uniqueMovies);
        setMoviePage(3);
        console.log("Initial movies loaded:", uniqueMovies);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };
    if (!movies.length && !query && location.pathname === "/")
      loadInitialMovies();
  }, [movies.length, query, location.pathname]);

  useEffect(() => {
    if (
      location.pathname === "/actors" ||
      location.pathname.startsWith("/actor/")
    ) {
      setQuery(""); // Reset query only for actor pages initially
    }
    console.log(
      "Current path:",
      location.pathname,
      "Query:",
      query,
      "Movies:",
      movies,
      "Actors:",
      actors
    );
  }, [location.pathname, movies, query, actors]);

  return (
    <>
      <Navbar onSearch={handleSearch} currentPath={location.pathname} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              movies={movies}
              loading={loading}
              error={error}
              page={moviePage}
              setPage={setMoviePage}
              setMovies={setMovies}
            />
          }
        />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<Favorites movies={movies} />} />
        <Route
          path="/actors"
          element={
            <Actors
              actors={actors}
              loading={loading}
              error={error}
              page={actorPage}
              setPage={setActorPage}
              setActors={setActors}
              query={query}
            />
          }
        />
        <Route path="/actor/:id" element={<ActorDetails />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <div className="min-h-screen bg-gray-900 text-gray-100">
          <AppContent />
        </div>
      </Router>
    </FavoritesProvider>
  );
}

export default App;
