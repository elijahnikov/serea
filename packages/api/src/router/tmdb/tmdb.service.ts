import type { ZodSchema } from "zod";
import { env } from "../../../env";
import { TRPCError } from "@trpc/server";
import { TMDB_API_URLS } from "../../utils/contants";

import type { SearchMoviesInput } from "./tmdb.input";
import {
	searchMoviesSchema,
	searchShowsSchema,
	trendingMoviesSchema,
} from "@serea/validators";

const fetchTemplate = async <T>(
	url: string,
	schema: ZodSchema<T>,
): Promise<T> => {
	const response = await fetch(url, {
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
		},
	});
	if (!response.ok) {
		throw new TRPCError({ code: "BAD_REQUEST" });
	}
	const data = await response.json();
	const validated = schema.parse(data);
	return validated;
};

export const getTrendingThisWeek = async () => {
	return fetchTemplate(TMDB_API_URLS.trendingThisWeek, trendingMoviesSchema);
};

export const searchMovies = async (input: SearchMoviesInput) => {
	return fetchTemplate(
		TMDB_API_URLS.movieSearch(new URLSearchParams(input).toString()),
		searchMoviesSchema,
	);
};

export const searchShows = async (input: SearchMoviesInput) => {
	return fetchTemplate(
		TMDB_API_URLS.showSearch(new URLSearchParams(input).toString()),
		searchShowsSchema,
	);
};
