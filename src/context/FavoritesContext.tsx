import { createContext, useContext, useState, ReactNode } from "react";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface FavoritesContextType {
  favorites: Movie[];
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Movie[]>([]);

  const addFavorite = (movie: Movie) => {
    setFavorites((prev) => [...prev, movie]);
  };

  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== id));
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error("useFavorites must be used within a FavoritesProvider");
  return context;
};
