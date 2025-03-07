import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Actor } from "../types/Actor";
import { config } from "../constants/config";
import LoadingSpinner from "../components/LoadingSpinner";
import { fetchActors, searchActors } from "../api/api";

interface ActorsProps {
  actors: Actor[];
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  setActors: React.Dispatch<React.SetStateAction<Actor[]>>;
  query: string;
}

export default function Actors({
  actors,
  loading,
  error,
  page,
  setPage,
  setActors,
  query,
}: ActorsProps) {
  const navigate = useNavigate();

  const loadMore = useCallback(async () => {
    if (loading) return;
    try {
      const data = query.trim()
        ? await searchActors(query, page)
        : await fetchActors(page);
      const filteredData = data.filter((a) => a.profile_path);
      setActors((prev) => [...prev, ...filteredData]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to load more actors:", err);
    }
  }, [loading, query, page, setActors, setPage]);

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

  useEffect(() => {
    if (!actors.length && !query.trim()) {
      loadMore();
    }
  }, [actors.length, query, loadMore]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-100 mb-4">Actors</h1>
      {loading && !actors.length && <LoadingSpinner />}
      {error && <p className="text-red-400 text-center">{error}</p>}
      {actors.length === 0 && !loading && (
        <p className="text-center text-gray-400">No actors found.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {actors.map((actor) => (
          <div
            key={actor.id}
            className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => navigate(`/actor/${actor.id}`)}
          >
            <img
              src={`${config.IMAGE_BASE_URL}/w200${actor.profile_path}`}
              alt={actor.name}
              className="w-full h-132 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 p-2">
              <h3 className="text-lg font-semibold text-gray-100">
                {actor.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
      {loading && actors.length > 0 && (
        <div className="text-center mt-6">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
