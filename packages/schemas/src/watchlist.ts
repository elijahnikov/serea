import { z } from "zod";
import { movieTableData } from "./movie";

// --------------------------------------------------------------------
// FORMS
// --------------------------------------------------------------------
export const watchlistInvite = z.object({
	email: z.string().email(),
	role: z.enum(["viewer", "editor"]),
});
export type WatchlistInvite = z.infer<typeof watchlistInvite>;

// --------------------------------------------------------------------
// QUERIES
// --------------------------------------------------------------------

// --------------------------------------------------------------------
// ACTIONS
// --------------------------------------------------------------------

// ADD ENTRY TO WATCHLIST
export const addWatchlistEntry = z.object({
	id: z.string(),
	watchlistId: z.string(),
	contentId: z.number(),
	content: movieTableData.omit({ order: true }),
});

// CLONE WATCHLIST
export const cloneWatchlist = z.object({
	id: z.string(),
});

// CREATE WATCHLIST
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

// DELETE WATCHLIST ENTRY
export const deleteWatchlistEntry = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});

// TOGGLE WATCHLIST LIKE
export const toggleWatchlistLike = z.object({
	watchlistId: z.string(),
});

// UPDATE ENTRY ORDER
export const updateEntryOrder = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
	newOrder: z.number(),
});

export type UpdateEntryOrder = z.infer<typeof updateEntryOrder>;
export type ToggleWatchlistLike = z.infer<typeof toggleWatchlistLike>;
export type DeleteWatchlistEntry = z.infer<typeof deleteWatchlistEntry>;
export type CreateWatchlist = z.infer<typeof createWatchlist>;
export type CloneWatchlist = z.infer<typeof cloneWatchlist>;
export type AddWatchlistEntry = z.infer<typeof addWatchlistEntry>;
