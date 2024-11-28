import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "../../trpc";

import * as inputs from "./tmdb.input";
import * as services from "./tmdb.service";

export const tmdbRouter = {
	searchMovies: protectedProcedure
		.input(inputs.searchMovies)
		.query(({ input }) => services.searchMovies(input)),

	trendingThisWeek: publicProcedure
		.meta({ name: "get-trending-this-week" })
		.query(services.trendingThisWeek),
} satisfies TRPCRouterRecord;
