import { movieDetailsSchema } from "@serea/validators";
import type { ProtectedTRPCContext } from "../../trpc";
import { TMDB_API_URLS, tmdbFetch } from "../tmdb/constants";
import type { AddMovieInput } from "./movie.input";

export const addMovie = async (
	ctx: ProtectedTRPCContext,
	input: AddMovieInput,
) => {
	const movieDetails = await tmdbFetch({
		url: TMDB_API_URLS.movieDetails(input.contentId.toString()),
		schema: movieDetailsSchema,
	});

	const insertData = {
		...input,
		runtime: movieDetails.runtime,
		budget: movieDetails.budget,
		revenue: movieDetails.revenue,
		imdbId: movieDetails.imdb_id,
		genres: movieDetails.genres.map((genre) => genre.name),
	};

	await ctx.db.movie.upsert({
		where: {
			contentId: input.contentId,
		},
		update: insertData,
		create: insertData,
	});

	return {
		success: true,
	};
};
