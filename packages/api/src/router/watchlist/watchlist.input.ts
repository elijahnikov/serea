import { z } from "zod";

export const movieTableData = z.object({
	contentId: z.number(),
	title: z.string(),
	overview: z.string().optional(),
	poster: z.string().nullable(),
	backdrop: z.string().nullable(),
	releaseDate: z.string(),
	order: z.number(),
});

export const addWatchlistEntry = z.object({
	watchlistId: z.string(),
	contentId: z.number(),
	content: movieTableData.omit({ order: true }),
});
export type AddWatchlistEntryInput = z.infer<typeof addWatchlistEntry>;

export const cloneWatchlist = z.object({
	id: z.string(),
});

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
export type CreateWatchlistInput = z.infer<typeof createWatchlist>;

export const deleteWatchlistEntry = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});

export const toggleWatchlistLike = z.object({
	watchlistId: z.string(),
});

export const updateEntryOrder = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
	newOrder: z.number(),
});

export const getWatchlist = z.object({
	id: z.string(),
});
export type GetWatchlistInput = z.infer<typeof getWatchlist>;

export const getWatchlistEntries = z.object({
	id: z.string(),
});
export type GetWatchlistEntriesInput = z.infer<typeof getWatchlistEntries>;

export const getWatchlistLikes = z.object({
	id: z.string(),
});
export type GetWatchlistLikesInput = z.infer<typeof getWatchlistLikes>;
