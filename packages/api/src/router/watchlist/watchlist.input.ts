import { movieTableData } from "@serea/validators";
import { z } from "zod";

export const createWatchlist = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string().optional(),
	tags: z.string().array(),
	entries: movieTableData.array(),
	isPrivate: z.boolean().optional(),
	hideStats: z.boolean().optional(),
});
export type CreateWatchlistInput = z.infer<typeof createWatchlist>;

export const getWatchlist = z.object({
	id: z.string(),
});
export type GetWatchlistInput = z.infer<typeof getWatchlist>;

export const likeWatchlist = z.object({
	id: z.string(),
});
export type LikeWatchlistInput = z.infer<typeof likeWatchlist>;
