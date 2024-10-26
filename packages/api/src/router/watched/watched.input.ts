import { z } from "zod";

export const toggleWatchedSchema = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type ToggleWatchedSchemaType = z.infer<typeof toggleWatchedSchema>;

export const toggleAllWatchedSchema = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type ToggleAllWatchedSchemaType = z.infer<typeof toggleAllWatchedSchema>;

export const getWatchStatusSchema = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type GetWatchStatusSchemaType = z.infer<typeof getWatchStatusSchema>;
