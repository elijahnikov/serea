import { trendingMoviesSchema } from "@serea/validators";
import { TMDB_API_URLS, tmdbFetch } from "./constants";

export const trendingThisWeek = async () => {
	return tmdbFetch({
		url: TMDB_API_URLS.trendingThisWeek,
		schema: trendingMoviesSchema,
	});
};
