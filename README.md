# Movie App

This is a React-based Movie App that allows users to browse movies, view details, and mark favorites. It uses Tailwind CSS for styling and React Router for navigation.

## Features
- Display a list of trending movies
- Search for movies
- View movie details
- Add/remove movies from favorites
- Infinite scrolling for movie loading
- Responsive UI with Tailwind CSS
- Smooth navigation using React Router

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/movie-app.git
   cd movie-app
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   ```

## Technologies Used
- **React** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Vite** for development

## Components Overview

### Navbar.tsx
- Provides navigation between "Home" and "Favorites" pages.

### MovieCard.tsx
- Displays a movie's poster, title, rating, and favorite toggle button.

### LoadingSpinner.tsx
- Shows a spinning loader while content is being fetched.

### SearchBar.tsx
- Allows users to search for movies within favorites or the main list.

### FavoritesContext.tsx
- Manages the state for favorite movies using React Context API.

### movies.ts
- Contains API calls for fetching trending movies and searching for movies.

### App.tsx
- The main app component that sets up React Router and includes global layout elements.

### Home.tsx
- Displays trending movies with infinite scrolling and search functionality.

### Favorites.tsx
- Displays the list of favorite movies with a search bar and infinite scrolling.

### MovieDetails.tsx
- Shows detailed information about a selected movie.

## How It Works
1. **Home Page**
   - Displays trending movies using `fetchTrendingMovies()` from `movies.ts`.
   - Allows searching movies with `searchMovies()`.
   - Uses infinite scrolling to load more movies.

2. **Favorites Page**
   - Lists favorite movies stored in context.
   - Allows searching within favorites.
   - Uses infinite scrolling to load more favorites.

3. **Movie Details Page**
   - Displays details of a selected movie.
   - Allows adding/removing a movie from favorites.

## License
This project is licensed under the MIT License.
