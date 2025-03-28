import { env } from "@serea/auth/env";
import { TRPCError } from "@trpc/server";
import type { ZodSchema } from "zod";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const apis = [
	"trendingThisWeek",
	"movieSearch",
	"movieDetails",
	"watchProviders",
] as const;
type Api = (typeof apis)[number];

export const TMDB_API_URLS = {
	trendingThisWeek: `${TMDB_BASE_URL}/trending/movie/week?language=en-US`,
	movieSearch: (query: string) =>
		`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
	movieDetails: (id: string) => `${TMDB_BASE_URL}/movie/${id}?language=en-US`,
	watchProviders: (id: string) =>
		`${TMDB_BASE_URL}/movie/${id}/watch/providers`,
} satisfies Record<Api, string | ((query: string) => string)>;

type TmdbFetchOptions<T> = {
	url: string;
	schema: ZodSchema<T>;
};

export const tmdbFetch = async <T>({
	url,
	schema,
}: TmdbFetchOptions<T>): Promise<T> => {
	const options = {
		method: "GET",
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
		},
	};

	const response = await fetch(url, options);

	if (!response.ok) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: `Could not fetch TMDB data at ${url}`,
		});
	}

	const data = await response.json();
	const parsed = schema.safeParse(data);

	if (!parsed.success) {
		console.log(parsed.error);
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Invalid response from TMDB",
		});
	}

	return parsed.data;
};
