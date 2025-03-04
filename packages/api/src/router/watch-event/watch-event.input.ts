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
