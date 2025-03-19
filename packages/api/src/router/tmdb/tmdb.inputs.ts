import { z } from "zod";

export const movieSearch = z.object({
	query: z.string(),
});
export type MovieSearch = z.infer<typeof movieSearch>;

export const watchProviders = z.object({
	id: z.string(),
});
export type WatchProviders = z.infer<typeof watchProviders>;
