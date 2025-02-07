import { searchMoviesSchema, trendingMoviesSchema } from "@serea/validators";
import { TMDB_API_URLS, tmdbFetch } from "./constants";

export const trendingThisWeek = async () => {
	return tmdbFetch({
		url: TMDB_API_URLS.trendingThisWeek,
		schema: trendingMoviesSchema,
	});
};

export const movieSearch = async (query: string) => {
	return tmdbFetch({
		url: TMDB_API_URLS.movieSearch(query),
		schema: searchMoviesSchema,
	});
};
