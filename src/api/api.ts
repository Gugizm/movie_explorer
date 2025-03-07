import axios, { AxiosInstance } from "axios";
import { config } from "../constants/config";
import { Movie } from "../types/Movie";
import { Actor } from "../types/Actor";

const api: AxiosInstance = axios.create({
  baseURL: config.BASE_URL,
  params: { api_key: config.API_KEY },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const fetchTrendingMovies = async (
  page: number = 1
): Promise<Movie[]> => {
  const response = await api.get("/trending/movie/week", { params: { page } });
  return response.data.results;
};

export const fetchMovieDetails = async (id: string): Promise<Movie> => {
  const response = await api.get(`/movie/${id}`, {
    params: { append_to_response: "credits" },
  });
  return response.data;
};

export const searchMovies = async (
  query: string,
  page: number = 1
): Promise<Movie[]> => {
  const response = await api.get("/search/movie", { params: { query, page } });
  return response.data.results;
};

export const searchActors = async (
  query: string,
  page: number = 1
): Promise<Actor[]> => {
  const response = await api.get("/search/person", { params: { query, page } });
  return response.data.results;
};

export const fetchActors = async (page: number = 1): Promise<Actor[]> => {
  const response = await api.get("/person/popular", { params: { page } });
  return response.data.results;
};

export const fetchActorDetails = async (id: string): Promise<Actor> => {
  const response = await api.get(`/person/${id}`);
  return response.data;
};

export const fetchActorMovies = async (id: string): Promise<Movie[]> => {
  const response = await api.get(`/person/${id}/movie_credits`);
  return response.data.cast;
};

export default api;
