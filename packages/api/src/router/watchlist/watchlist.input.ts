import { movieTableData } from "@serea/validators";
import { z } from "zod";

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
export type CreateWatchlistInput = z.infer<typeof createWatchlist>;
