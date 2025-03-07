import { useEffect, useCallback } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Actor } from "../types/Actor";
import { searchActors } from "../api/api";
import { Dispatch, SetStateAction } from "react";
import { config } from "../constants/config";
import { useNavigate } from "react-router-dom";

interface ActorsProps {
  actors: Actor[];
  loading: boolean;
  error: string | null;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  setActors: Dispatch<SetStateAction<Actor[]>>;
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

  const loadActors = useCallback(async () => {
    if (loading) return;
    try {
      const newActors = await searchActors(query || "a", page);
      setActors((prev) => [
        ...prev,
        ...newActors.filter((a) => a.profile_path),
      ]);
    } catch (err) {
      console.error("Failed to load actors:", err);
    }
  }, [loading, page, query, setActors]);

  useEffect(() => {
    if (query) {
      setActors([]);
      setPage(1);
      loadActors();
    } else {
      loadActors();
    }
  }, [query, loadActors, setActors, setPage]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, setPage]);

  useEffect(() => {
    loadActors();
  }, [page, loadActors]);

  const handleActorClick = (id: number) => {
    navigate(`/actor/${id}`);
  };

  if (loading && actors.length === 0) return <LoadingSpinner />;
  if (error) return <p className="text-red-400 text-center">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-100 mb-4">Actors</h1>
      {actors.length === 0 && !loading ? (
        <p className="text-center text-gray-400">No actors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {actors.map((actor) => {
            const knownForItem = actor.known_for?.[0];
            const knownForText = knownForItem
              ? "title" in knownForItem
                ? knownForItem.title
                : "name" in knownForItem
                ? knownForItem.name
                : "N/A"
              : "N/A";

            return (
              <div
                key={actor.id}
                className="relative group w-full max-w-xs h-96 cursor-pointer"
                onClick={() => handleActorClick(actor.id)}
              >
                <img
                  src={`${config.IMAGE_BASE_URL}/w500${actor.profile_path}`}
                  alt={actor.name}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 h-20 backdrop-blur-sm text-gray-100 transition-all rounded-b-lg">
                  <div className="p-2">
                    <h3 className="text-base font-semibold truncate">
                      {actor.name}
                    </h3>
                    <p className="text-sm">Known For: {knownForText}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {loading && actors.length > 0 && (
        <div className="text-center mt-6">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
}
