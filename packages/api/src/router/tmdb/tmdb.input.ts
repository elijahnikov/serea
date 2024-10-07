import { z } from "zod";

export const searchMoviesSchema = z.object({
	query: z.string(),
});
export type SearchMoviesInput = z.infer<typeof searchMoviesSchema>;
