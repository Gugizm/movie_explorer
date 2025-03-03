import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Search...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search submitted:", query); // Debug
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex justify-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full max-w-md p-2 rounded-l border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition z-20"
      >
        Search
      </button>
    </form>
  );
}
