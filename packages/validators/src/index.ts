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

export const createWatchlist = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string().optional(),
	tags: z.string().array(),
	entries: movieTableData.array(),
	private: z.boolean().optional(),
	hideStats: z.boolean().optional(),
});
export type CreateWatchlist = z.infer<typeof createWatchlist>;
