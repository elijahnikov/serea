import type { MovieTableSchemaType } from "@serea/validators";
import type { ProtectedTRPCContext } from "../../trpc";
import { Movie } from "@serea/db/schema";
import { env } from "../../../env";

export const createMovie = async (
	ctx: ProtectedTRPCContext,
	input: Omit<MovieTableSchemaType, "order">,
) => {
	const movie = await ctx.db.query.Movie.findFirst({
		where: (table, { eq }) => eq(table.contentId, input.contentId),
	});

	if (!movie) {
		const baseUrl = env.VERCEL_URL
			? `https://${env.VERCEL_URL}`
			: `http://localhost:${process.env.PORT ?? 3000}`;
		const response = await fetch(
			`${baseUrl}/api/base64?url=${`https://image.tmdb.org/t/p/w500${input.poster}`}`,
		);
		const { base64 } = (await response.json()) as { base64: string };

		await ctx.db.insert(Movie).values({ ...input, posterBlurhash: base64 });
	}
	return input.contentId;
};
