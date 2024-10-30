import { movieTableSchema } from "@serea/validators";
import { authActionClient } from "../safe-action";
import { env } from "~/env";
import { Movie } from "@serea/db/schema";

export const addMovieAction = authActionClient
	.schema(movieTableSchema.omit({ order: true }))
	.metadata({ name: "add-movie" })
	.action(async ({ parsedInput, ctx }) => {
		const movie = await ctx.db.query.Movie.findFirst({
			where: (table, { eq }) => eq(table.contentId, parsedInput.contentId),
		});

		if (!movie) {
			const baseUrl = env.VERCEL_URL
				? `https://${env.VERCEL_URL}`
				: `http://localhost:${process.env.PORT ?? 3000}`;
			const response = await fetch(
				`${baseUrl}/api/base64?url=${`https://image.tmdb.org/t/p/w500${parsedInput.poster}`}`,
			);
			const { base64 } = (await response.json()) as { base64: string };

			await ctx.db
				.insert(Movie)
				.values({ ...parsedInput, posterBlurhash: base64 });
		}
		return parsedInput.contentId;
	});
