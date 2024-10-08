import { z } from "zod";

// TRENDING MOVIES
// --------------------------------------------------------------------
export type TrendingMoviesType = z.infer<typeof trendingMoviesSchema>;
export const trendingMoviesSchema = z.object({
	page: z.number(),
	results: z.array(
		z.object({
			backdrop_path: z.string(),
			id: z.number(),
			title: z.string(),
			original_title: z.string(),
			overview: z.string(),
			poster_path: z.string(),
			media_type: z.string(),
			adult: z.boolean(),
			original_language: z.string(),
			genre_ids: z.array(z.number()),
			popularity: z.number(),
			release_date: z.string(),
			video: z.boolean(),
			vote_average: z.number(),
			vote_count: z.number(),
		}),
	),
	total_pages: z.number(),
	total_results: z.number(),
});

// SEARCH MOVIES
// --------------------------------------------------------------------
export type SearchMoviesType = z.infer<typeof searchMoviesSchema>;
export const searchMoviesSchema = z.object({
	page: z.number(),
	results: z.array(
		z.object({
			adult: z.boolean(),
			backdrop_path: z.string().nullable(),
			genre_ids: z.array(z.number()),
			id: z.number(),
			original_language: z.string(),
			original_title: z.string(),
			overview: z.string(),
			popularity: z.number(),
			poster_path: z.string().nullable(),
			release_date: z.string(),
			title: z.string(),
			video: z.boolean(),
			vote_average: z.number(),
			vote_count: z.number(),
		}),
	),
	total_pages: z.number(),
	total_results: z.number(),
});

// SEARCH SHOWS
// --------------------------------------------------------------------
export type SearchShowsType = z.infer<typeof searchShowsSchema>;
export const searchShowsSchema = z.object({
	page: z.number(),
	results: z.array(
		z.object({
			adult: z.boolean(),
			backdrop_path: z.string().nullable(),
			genre_ids: z.array(z.number()),
			id: z.number(),
			origin_country: z.array(z.string()),
			original_language: z.string(),
			original_name: z.string(),
			overview: z.string(),
			popularity: z.number(),
			poster_path: z.string().nullable(),
			first_air_date: z.string(),
			name: z.string(),
			vote_average: z.number(),
			vote_count: z.number(),
		}),
	),
	total_pages: z.number(),
	total_results: z.number(),
});

// DATABASE: MOVIE TABLE
// --------------------------------------------------------------------
export type MovieTableSchemaType = z.infer<typeof movieTableSchema>;
export const movieTableSchema = z.object({
	contentId: z.number(),
	title: z.string(),
	overview: z.string().optional(),
	poster: z.string().nullable(),
	backdrop: z.string().nullable(),
	releaseDate: z.string(),
	order: z.number(),
});
