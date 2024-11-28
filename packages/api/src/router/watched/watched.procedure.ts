import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./watched.input";
import * as services from "./watched.service";

export const watchedRouter = {
	// QUERIES
	getWatchlistProgress: protectedProcedure
		.input(inputs.getWatchlistProgress)
		.query(({ ctx, input }) => services.getWatchlistProgress(ctx, input)),

	// MUTATIONS
	toggleWatched: protectedProcedure
		.input(inputs.toggleWatched)
		.meta({ name: "toggle-watched" })
		.mutation(({ ctx, input }) => services.toggleWatched(ctx, input)),

	toggleAllWatched: protectedProcedure
		.input(inputs.toggleAllWatched)
		.meta({ name: "toggle-all-watched" })
		.mutation(({ ctx, input }) => services.toggleAllWatched(ctx, input)),
} satisfies TRPCRouterRecord;
