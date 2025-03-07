export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres?: Genre[];
  cast?: Cast[];
  credits?: {
    cast: Cast[];
  };
}
