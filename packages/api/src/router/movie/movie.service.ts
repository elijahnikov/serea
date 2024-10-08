import type { MovieTableSchemaType } from "@serea/validators";
import type { ProtectedTRPCContext } from "../../trpc";
import { Movie } from "@serea/db/schema";

export const createMovie = async (
	ctx: ProtectedTRPCContext,
	input: Omit<MovieTableSchemaType, "order">,
) => {
	const movie = await ctx.db.query.Movie.findFirst({
		where: (table, { eq }) => eq(table.contentId, input.contentId),
	});
	if (!movie) await ctx.db.insert(Movie).values(input);
	return input.contentId;
};
