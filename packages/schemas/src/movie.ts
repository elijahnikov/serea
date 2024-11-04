import { z } from "zod";

// --------------------------------------------------------------------
// EXTERNAL API
// --------------------------------------------------------------------

// TRENDING MOVIES
export const trendingMovies = z.object({
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

// TMDB MOVIE DATA
export const movieTableData = z.object({
	contentId: z.number(),
	title: z.string(),
	overview: z.string().optional(),
	poster: z.string().nullable(),
	backdrop: z.string().nullable(),
	releaseDate: z.string(),
	order: z.number(),
});

// SEARCH MOVIES
export const searchMovies = z.object({
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

export type SearchMovies = z.infer<typeof searchMovies>;
export type MovieTableData = z.infer<typeof movieTableData>;
export type TrendingMovies = z.infer<typeof trendingMovies>;
