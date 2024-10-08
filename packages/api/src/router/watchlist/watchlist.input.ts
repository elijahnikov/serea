import { z } from "zod";

export const getWatchlistSchema = z.object({
	id: z.string(),
});
export type GetWatchlistSchemaType = z.infer<typeof getWatchlistSchema>;
