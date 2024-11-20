import { TMDB_API_URLS, tmdbFetch } from "./constants";
import { trendingMoviesSchema } from "@serea/validators";
import type { SearchMovies } from "./tmdb.input";
import { searchMoviesSchema } from "@serea/validators";

export const trendingThisWeek = async () => {
	return tmdbFetch(TMDB_API_URLS.trendingThisWeek, trendingMoviesSchema);
};

export const searchMovies = async (input: SearchMovies) => {
	return tmdbFetch(TMDB_API_URLS.movieSearch(input.query), searchMoviesSchema);
};
