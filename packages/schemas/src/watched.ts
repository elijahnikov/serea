import { z } from "zod";
// --------------------------------------------------------------------
// QUERIES
// --------------------------------------------------------------------

// GET WATCH STATUS FOR A WATCHLIST
export const getWatchStatus = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type GetWatchStatus = z.infer<typeof getWatchStatus>;

// --------------------------------------------------------------------
// ACTIONS
// --------------------------------------------------------------------

// TOGGLE ALL WATCHED FOR A WATCHLIST
export const toggleAllWatched = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});

// TOGGLE A SINGLE WATCHED FOR A WATCHLIST
export const toggleWatched = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});

// GET WATCHLIST PROGRESS
export const getWatchlistProgress = z.object({
	watchlistId: z.string(),
});

export type GetWatchlistProgress = z.infer<typeof getWatchlistProgress>;
export type ToggleWatched = z.infer<typeof toggleWatched>;
export type ToggleAllWatched = z.infer<typeof toggleAllWatched>;
