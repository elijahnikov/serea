import type { TRPCRouterRecord } from "@trpc/server";
import * as inputs from "./tmdb.input";
import { protectedProcedure } from "../../trpc";

export const tmdbRouter = {
	searchMovies: protectedProcedure
		.input(inputs.searchMovies)
		.query(({ ctx, input }) => {}),

	trendingThisWeek: protectedProcedure.query(({ ctx, input }) => {}),
} satisfies TRPCRouterRecord;
