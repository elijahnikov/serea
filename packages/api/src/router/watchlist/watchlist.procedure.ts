import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import * as inputs from "./watchlist.input";

export const watchlistRouter = {
	// QUERIES
	get: protectedProcedure
		.input(inputs.getWatchlist)
		.query(({ ctx, input }) => {}),

	getEntries: protectedProcedure
		.input(inputs.getWatchlistEntries)
		.query(({ ctx, input }) => {}),

	getLikes: protectedProcedure
		.input(inputs.getWatchlistLikes)
		.query(({ ctx, input }) => {}),

	// MUTATIONS
	create: protectedProcedure
		.input(inputs.createWatchlist)
		.mutation(({ ctx, input }) => {}),

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
