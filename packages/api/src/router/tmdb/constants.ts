import { env } from "@serea/auth/env";
import { TRPCError } from "@trpc/server";
import type { ZodSchema } from "zod";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const apis = ["trendingThisWeek", "movieSearch", "showSearch"] as const;
type Api = (typeof apis)[number];

export const TMDB_API_URLS = {
	trendingThisWeek: `${TMDB_BASE_URL}/trending/movie/week?language=en-US`,
	movieSearch: (query: string) =>
		`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
	showSearch: (query: string) =>
		`${TMDB_BASE_URL}/search/tv?query=${encodeURIComponent(query)}include_adult=false&language=en-US&page=1`,
} satisfies Record<Api, string | ((query: string) => string)>;

export const tmdbFetch = async <T>(
	url: string,
	schema: ZodSchema<T>,
): Promise<T> => {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
		},
	};

	console.log({ url });

	const response = await fetch(url, options);

	if (!response.ok) {
		throw new TRPCError({ code: "BAD_REQUEST" });
	}

	const data = await response.json();
	const validated = schema.safeParse(data);

	if (!validated.success) {
		throw new TRPCError({ code: "BAD_REQUEST" });
	}

	return validated.data;
};
