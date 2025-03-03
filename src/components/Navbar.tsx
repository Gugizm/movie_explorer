import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-gray-100 shadow-lg">
      <ul className="flex space-x-6 justify-center">
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
      </ul>
    </nav>
  );
}
