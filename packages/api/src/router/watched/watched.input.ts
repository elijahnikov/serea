import { z } from "zod";

export const toggleWatched = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});

export const toggleAllWatched = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});

export const getWatchlistProgress = z.object({
	watchlistId: z.string(),
});

export const getWatchStatus = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
