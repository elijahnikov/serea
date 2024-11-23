import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./watched.input";
import * as services from "./watched.service";

export const watchedRouter = {
	// QUERIES
	getWatchlistProgress: protectedProcedure
		.input(inputs.getWatchlistProgress)
		.query(({ ctx, input }) => services.getWatchlistProgress(ctx, input)),

	getWatchStatus: protectedProcedure
		.input(inputs.getWatchStatus)
		.query(({ ctx, input }) => {}),

	// MUTATIONS
	toggleWatched: protectedProcedure
		.input(inputs.toggleWatched)
		.mutation(({ ctx, input }) => services.toggleWatched(ctx, input)),

	toggleAllWatched: protectedProcedure
		.input(inputs.toggleAllWatched)
		.mutation(({ ctx, input }) => services.toggleAllWatched(ctx, input)),
} satisfies TRPCRouterRecord;
