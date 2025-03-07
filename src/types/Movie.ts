export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path?: string;
  overview: string;
  release_date?: string;
  vote_average?: number;
  genres?: { id: number; name: string }[];
  cast?: { id: number; name: string; character: string }[];
}
