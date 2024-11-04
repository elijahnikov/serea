"use server";

import { unstable_cache } from "next/cache";
import { fetchTemplate, TMDB_API_URLS } from "./constants";

import { z } from "zod";
import { searchMovies as searchMoviesSchema } from "@serea/schemas/movie";

const searchMoviesInputSchema = z.object({
	query: z.string(),
});
export type SearchMoviesInput = z.infer<typeof searchMoviesInputSchema>;

export type SearchMoviesReturnType = Awaited<ReturnType<typeof searchMovies>>;

export const searchMovies = async (params: SearchMoviesInput) => {
	return unstable_cache(
		async () => {
			return fetchTemplate(
				TMDB_API_URLS.movieSearch(new URLSearchParams(params).toString()),
				searchMoviesSchema,
			);
		},
		["tmdb-search-movies", params.query],
		{
			tags: [`tmdb-search-movies_${params.query}`],
			revalidate: 60 * 30, // 30 minutes
		},
	)();
};
