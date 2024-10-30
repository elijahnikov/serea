import type { ZodSchema } from "zod";
import { env } from "~/env";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const TMDB_API_URLS = {
	trendingThisWeek: `${TMDB_BASE_URL}/trending/movie/week?language=en-US`,
	movieSearch: (query: string) =>
		`${TMDB_BASE_URL}/search/movie?${query}&include_adult=false&language=en-US&page=1`,
	showSearch: (query: string) =>
		`${TMDB_BASE_URL}/search/tv?${query}include_adult=false&language=en-US&page=1`,
};

export const fetchTemplate = async <T>(
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
		throw new Error("BAD_REQUEST");
	}
	const data = await response.json();
	const validated = schema.parse(data);
	return validated;
};
