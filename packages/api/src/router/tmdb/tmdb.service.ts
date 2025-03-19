import {
	searchMoviesSchema,
	trendingMoviesSchema,
	watchProvidersSchema,
} from "@serea/validators";
import { TMDB_API_URLS, tmdbFetch } from "./constants";
import type { MovieSearch, WatchProviders } from "./tmdb.inputs";

export const trendingThisWeek = async () => {
	return tmdbFetch({
		url: TMDB_API_URLS.trendingThisWeek,
		schema: trendingMoviesSchema,
	});
};

export const movieSearch = async (input: MovieSearch) => {
	return tmdbFetch({
		url: TMDB_API_URLS.movieSearch(input.query),
		schema: searchMoviesSchema,
	});
};

export const getWatchProviders = async (input: WatchProviders) => {
	return tmdbFetch({
		url: TMDB_API_URLS.watchProviders(input.id),
		schema: watchProvidersSchema,
	});
};
