import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname === "/actors" ||
      location.pathname.startsWith("/actor/")
    ) {
      setQuery(""); // Reset only for actor pages
    }
  }, [location.pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", query, "from:", location.pathname);
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-md p-2 rounded-l border border-gray-700 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
      <button
        type="submit"
        className="bg-gray-700 text-gray-100 p-2 rounded-r hover:bg-gray-600 transition"
      >
        Search
      </button>
    </form>
  );
}
