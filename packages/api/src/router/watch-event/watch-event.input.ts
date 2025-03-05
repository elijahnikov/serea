import { z } from "zod";

export const createWatchEvent = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
	date: z.date(),
	runtime: z.number(),
});
export type CreateWatchEventInput = z.infer<typeof createWatchEvent>;

export const deleteWatchEvent = z.object({
	id: z.string(),
});
export type DeleteWatchEventInput = z.infer<typeof deleteWatchEvent>;

export const getWatchEventForWatchlist = z.object({
	watchlistId: z.string(),
});
export type GetWatchEventForWatchlistInput = z.infer<
	typeof getWatchEventForWatchlist
>;
