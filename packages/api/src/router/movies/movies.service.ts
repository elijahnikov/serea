import { env } from "@serea/auth/env";
import type { ProtectedTRPCContext } from "../../trpc";
import type { AddMovieInput } from "./movies.input";
import { movie } from "@serea/db/schema";

export const addMovie = async (
	ctx: ProtectedTRPCContext,
	input: AddMovieInput,
) => {
	const existingMovie = await ctx.db.query.movie.findFirst({
		where: (table, { eq }) => eq(table.contentId, input.contentId),
		columns: { contentId: true },
	});

	if (!existingMovie) {
		// const baseUrl = env.VERCEL_URL
		// 	? `https://${env.VERCEL_URL}`
		// 	: `http://localhost:${process.env.PORT ?? 3000}`;
		// const response = await fetch(
		// 	`${baseUrl}/api/base64?url=${`https://image.tmdb.org/t/p/w500${input.poster}`}`,
		// );
		// const { base64 } = (await response.json()) as { base64: string | null };

		await ctx.db.insert(movie).values({ ...input, posterBlurHash: null });
	}
	return input.contentId;
};
