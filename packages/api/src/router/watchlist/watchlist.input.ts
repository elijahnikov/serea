import { movieTableSchema } from "@serea/validators";
import { z } from "zod";

export const getWatchlistSchema = z.object({
	id: z.string(),
});
export type GetWatchlistSchemaType = z.infer<typeof getWatchlistSchema>;

export const getWatchlistEntriesSchema = z.object({
	id: z.string(),
});
export type GetWatchlistEntriesSchemaType = z.infer<
	typeof getWatchlistEntriesSchema
>;

export const deleteWatchlistEntrySchema = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type DeleteWatchlistEntrySchemaType = z.infer<
	typeof deleteWatchlistEntrySchema
>;

export const addWatchlistEntrySchema = z.object({
	id: z.string(),
	watchlistId: z.string(),
	contentId: z.number(),
	content: movieTableSchema.omit({ order: true }),
});
export type AddWatchlistEntrySchemaType = z.infer<
	typeof addWatchlistEntrySchema
>;

export const updateEntryOrderSchema = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
	newOrder: z.number(),
});
export type UpdateEntryOrderSchemaType = z.infer<typeof updateEntryOrderSchema>;
