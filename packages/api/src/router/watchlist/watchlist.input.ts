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

export const updateWatchlist = z.object({
	id: z.string(),
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string().optional(),
	tags: z.string().array(),
	private: z.boolean().optional(),
	hideStats: z.boolean().optional(),
});
export type UpdateWatchlistInput = z.infer<typeof updateWatchlist>;

export const updateWatchlistTitle = z.object({
	id: z.string(),
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
});
export type UpdateWatchlistTitleInput = z.infer<typeof updateWatchlistTitle>;

export const updateWatchlistDescription = z.object({
	id: z.string(),
	description: z.string().optional(),
});
export type UpdateWatchlistDescriptionInput = z.infer<
	typeof updateWatchlistDescription
>;

export const updateWatchlistTags = z.object({
	id: z.string(),
	tags: z.string().array(),
});
export type UpdateWatchlistTagsInput = z.infer<typeof updateWatchlistTags>;

export const deleteWatchlistEntry = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type DeleteWatchlistEntryInput = z.infer<typeof deleteWatchlistEntry>;

export const toggleWatchlistLike = z.object({
	watchlistId: z.string(),
});
export type ToggleLikeInput = z.infer<typeof toggleWatchlistLike>;
export const updateEntryOrder = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
	newOrder: z.number(),
});

export type UpdateEntryOrderInput = z.infer<typeof updateEntryOrder>;
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
