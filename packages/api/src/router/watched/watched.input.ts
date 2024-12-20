import { z } from "zod";

export const toggleWatched = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type ToggleWatchedInput = z.infer<typeof toggleWatched>;

export const toggleAllWatched = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type ToggleAllWatchedInput = z.infer<typeof toggleAllWatched>;

export const getWatchlistProgress = z.object({
	id: z.string(),
});
export type GetWatchlistProgressInput = z.infer<typeof getWatchlistProgress>;
export const getWatchStatus = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
