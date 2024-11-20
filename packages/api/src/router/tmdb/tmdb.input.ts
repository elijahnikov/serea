import { z } from "zod";

export const searchMovies = z.object({
	query: z.string(),
});
export type SearchMovies = z.infer<typeof searchMovies>;
