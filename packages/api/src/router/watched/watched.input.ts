import { z } from "zod";

export const createWatched = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type CreateWatched = z.infer<typeof createWatched>;

export const createWatchedForAll = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type CreateWatchedForAll = z.infer<typeof createWatchedForAll>;
