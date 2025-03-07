# Movie App

A React-based web application that allows users to explore trending movies, search for movies and actors, view detailed information, and manage a list of favorite movies. Built with TypeScript, Tailwind CSS, and the TMDB API, this app features infinite scrolling, a responsive design, and a Swiper-powered movie carousel.

## Features

- **Home Page**: Displays trending movies with infinite scroll and a coverflow-style slider.
- **Search**: Search for movies or actors with real-time results.
- **Movie Details**: View detailed information about a movie, including cast, genres, and ratings.
- **Actor Details**: Explore actor profiles with biography and filmography.
- **Favorites**: Add and remove movies from a favorites list, persisted in local storage.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.
- **API Integration**: Powered by the TMDB (The Movie Database) API for movie and actor data.

## Tech Stack

- **Frontend**: React, TypeScript, React Router
- **Styling**: Tailwind CSS
- **API Client**: Axios
- **Carousel**: Swiper
- **State Management**: React Context API
- **Build Tool**: Vite
- **Deployment**: Vercel

## Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **TMDB API Key**: Obtain an API key from [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api).

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Gugizm/movie_explorer.git
   cd movie_explorer

   ```

2. **Install Dependencies**:
   npm install

3. **Set Up Environment Variables**:

   - Create a .env file in the root directory.
   - Add the following variables (replace with your TMDB API key):
   - VITE_BASE_URL=https://api.themoviedb.org/3
   - VITE_API_KEY=your-tmdb-api-key-here
   - VITE_IMAGE_BASE_URL=https://image.tmdb.org/t/p

4. **Run the Development Server**:
   npm run dev
   Open http://localhost:5173 in your browser to view the app.

   **Usage**

   - Home: Browse trending movies and use the slider to explore featured titles. Scroll down to load more movies.
   - Search: Use the search bar in the navbar to find movies (on Home/Favorites) or actors (on Actors page).
   - Movie Details: Click a movie card to view its details, including cast and genres. Toggle the heart icon to add/remove from favorites.
   - Actor Details: Click an actor card to see their biography and filmography.
   - Favorites: View your saved movies and search within them.

   **Project Structure**
   movie-app/
   ├── public/
   │ ├── favicon.ico
   │ └── logo.png
   ├── src/
   │ ├── api/
   │ │ └── api.ts
   │ ├── components/
   │ │ ├── LoadingSpinner.tsx
   │ │ ├── MovieCard.tsx
   │ │ ├── MovieSlider.tsx
   │ │ ├── Navbar.tsx
   │ │ └── SearchBar.tsx
   │ ├── context/
   │ │ └── FavoritesContext.tsx
   │ ├── pages/
   │ │ ├── ActorDetails.tsx
   │ │ ├── Actors.tsx
   │ │ ├── Favorites.tsx
   │ │ ├── Home.tsx
   │ │ └── MovieDetails.tsx
   │ ├── types/
   │ │ ├── Actor.ts
   │ │ └── Movie.ts
   │ ├── utils/
   │ │ └── svgs.tsx
   │ ├── constants/
   │ │ └── config.ts
   │ ├── App.tsx
   │ ├── index.css
   │ ├── main.tsx
   │ └── vite-env.d.ts
   ├── .env
   ├── tsconfig.json
   ├── tsconfig.app.json
   ├── tsconfig.node.json
   ├── vite.config.ts
   ├── tailwind.config.js
   ├── package.json
   └── README.md

   **Scripts**

   - npm run dev: Start the development server.
   - npm run build: Build the app for production.
   - npm run lint: Run ESLint (if configured).
   - npm run preview: Preview the production build locally.

   **License**

   - This project is licensed under the MIT License
