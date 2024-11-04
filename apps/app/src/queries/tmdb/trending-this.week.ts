import { unstable_cache } from "next/cache";
import { fetchTemplate, TMDB_API_URLS } from "./constants";
import { trendingMoviesSchema } from "@serea/schemas";

export const getTrendingThisWeek = async () => {
	return unstable_cache(async () => {
		return fetchTemplate(TMDB_API_URLS.trendingThisWeek, trendingMoviesSchema);
	}, ["tmdb-trending-this-week"]);
};
