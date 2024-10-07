import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "../../trpc";
import * as services from "./tmdb.service";
import * as inputs from "./tmdb.input";

export const tmdbRouter = {
	trendingThisWeek: publicProcedure.query(async () =>
		services.getTrendingThisWeek(),
	),

	searchMovies: protectedProcedure
		.input(inputs.searchMoviesSchema)
		.query(async ({ input }) => services.searchMovies(input)),

	searchShows: protectedProcedure
		.input(inputs.searchMoviesSchema)
		.query(async ({ input }) => services.searchShows(input)),
} satisfies TRPCRouterRecord;
