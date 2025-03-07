import { NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";

interface NavbarProps {
  onSearch: (query: string) => void;
  currentPath: string; // Add currentPath prop
}

export default function Navbar({ onSearch, currentPath }: NavbarProps) {
  const getPlaceholder = () => {
    if (currentPath === "/actors" || currentPath.startsWith("/actor/")) {
      return "Search actors...";
    } else if (
      currentPath === "/" ||
      currentPath === "/favorites" ||
      currentPath.startsWith("/movie/")
    ) {
      return "Search movies...";
    }
    return "Search...";
  };

  return (
    <nav className="bg-gray-800 p-4 text-gray-100 shadow-lg">
      <div className="container mx-auto flex items-center justify-start">
        <NavLink to="/" className="flex items-center">
          <img src="/logo.png" alt="MovieApp Logo" className="w-8 h-8 mr-24" />
        </NavLink>
        <ul className="flex space-x-12 mr-36">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-gray-200"
                  : "hover:text-gray-300 transition"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-gray-200"
                  : "hover:text-gray-300 transition"
              }
            >
              Favorites
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/actors"
              className={({ isActive }) =>
                isActive
                  ? "font-bold text-gray-200"
                  : "hover:text-gray-300 transition"
              }
            >
              Actors
            </NavLink>
          </li>
        </ul>
        <div className="mx-4 w-134">
          <SearchBar onSearch={onSearch} placeholder={getPlaceholder()} />
        </div>
      </div>
    </nav>
  );
}
