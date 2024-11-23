import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./watchlist.input";
import * as services from "./watchlist.service";

export const watchlistRouter = {
	// QUERIES
	get: protectedProcedure
		.input(inputs.getWatchlist)
		.query(({ ctx, input }) => services.getWatchlist(ctx, input)),

	getEntries: protectedProcedure
		.input(inputs.getWatchlistEntries)
		.query(({ ctx, input }) => services.getWatchlistEntries(ctx, input)),

	getLikes: protectedProcedure
		.input(inputs.getWatchlistLikes)
		.query(({ ctx, input }) => services.getWatchlistLikes(ctx, input)),

	// MUTATIONS
	create: protectedProcedure
		.input(inputs.createWatchlist)
		.meta({ name: "create-watchlist" })
		.mutation(({ ctx, input }) => services.createWatchlist(ctx, input)),

	addEntry: protectedProcedure
		.input(inputs.addWatchlistEntry)
		.mutation(({ ctx, input }) => {}),

	clone: protectedProcedure
		.input(inputs.cloneWatchlist)
		.mutation(({ ctx, input }) => {}),

	deleteEntry: protectedProcedure
		.input(inputs.deleteWatchlistEntry)
		.mutation(({ ctx, input }) => {}),

	toggleLike: protectedProcedure
		.input(inputs.toggleWatchlistLike)
		.mutation(({ ctx, input }) => {}),

	updateEntryOrder: protectedProcedure
		.input(inputs.updateEntryOrder)
		.mutation(({ ctx, input }) => {}),
} satisfies TRPCRouterRecord;
