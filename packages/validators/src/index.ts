import { z } from "zod";

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
export type SearchMoviesSchema = z.infer<typeof searchMoviesSchema>;

export const movieTableData = z.object({
	contentId: z.number(),
	title: z.string(),
	overview: z.string().optional(),
	poster: z.string().nullable(),
	backdrop: z.string().nullable(),
	releaseDate: z.string(),
	order: z.number(),
});
export type MovieTableData = z.infer<typeof movieTableData>;

export const createWatchlistSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
	description: z.string().optional(),
	tags: z.array(z.string()),
	entries: z.array(movieTableData),
	private: z.boolean().default(false),
	hideStats: z.boolean().default(false),
});
export type CreateWatchlistSchema = z.infer<typeof createWatchlistSchema>;
