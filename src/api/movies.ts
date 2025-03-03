import axios from "axios";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchTrendingMovies = async () => {
  const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
    params: { api_key: API_KEY },
  });
  return response.data.results;
};

export const fetchMovieDetails = async (id: string) => {
  const response = await axios.get(`${BASE_URL}/movie/${id}`, {
    params: { api_key: API_KEY },
  });
  return response.data;
};
