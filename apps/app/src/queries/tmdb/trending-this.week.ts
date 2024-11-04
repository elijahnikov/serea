import { unstable_cache } from "next/cache";
import { fetchTemplate, TMDB_API_URLS } from "./constants";
import { trendingMovies } from "@serea/schemas/movie";

export const getTrendingThisWeek = async () => {
	return unstable_cache(async () => {
		return fetchTemplate(TMDB_API_URLS.trendingThisWeek, trendingMovies);
	}, ["tmdb-trending-this-week"]);
};
