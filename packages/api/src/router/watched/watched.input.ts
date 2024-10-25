import { z } from "zod";

export const toggleWatchedSchema = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type ToggleWatchedSchemaType = z.infer<typeof toggleWatchedSchema>;
