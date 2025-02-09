import type { ProtectedTRPCContext } from "../../trpc";
import type { AddMovieInput } from "./movie.input";

export const addMovie = async (
	ctx: ProtectedTRPCContext,
	input: AddMovieInput,
) => {
	await ctx.db.movie.upsert({
		where: {
			contentId: input.contentId,
		},
		update: input,
		create: input,
	});

	return {
		success: true,
	};
};
