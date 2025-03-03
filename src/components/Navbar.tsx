import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white">
      <ul className="flex space-x-6 justify-center">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? "font-bold" : "")}
          >
            Favorites
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
