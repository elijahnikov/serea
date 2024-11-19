import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import * as inputs from "./watched.input";

export const watchedRouter = {
	// QUERIES
	getWatchlistProgress: protectedProcedure
		.input(inputs.getWatchlistProgress)
		.query(({ ctx, input }) => {}),

	getWatchStatus: protectedProcedure
		.input(inputs.getWatchStatus)
		.query(({ ctx, input }) => {}),

	// MUTATIONS
	toggleWatched: protectedProcedure
		.input(inputs.toggleWatched)
		.mutation(({ ctx, input }) => {}),

	toggleAllWatched: protectedProcedure
		.input(inputs.toggleAllWatched)
		.mutation(({ ctx, input }) => {}),
} satisfies TRPCRouterRecord;
