import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./watchlist.input";
import * as services from "./watchlist.service";

export const watchlistRouter = {
	// QUERIES
	get: protectedProcedure
		.input(inputs.getWatchlist)
		.meta({ name: "get-watchlist" })
		.query(async ({ ctx, input }) => services.getWatchlist(ctx, input)),

	getEntries: protectedProcedure
		.input(inputs.getWatchlist)
		.meta({ name: "get-watchlist-entries" })
		.query(async ({ ctx, input }) => services.getWatchlistEntries(ctx, input)),

	getMembers: protectedProcedure
		.input(inputs.getWatchlist)
		.meta({ name: "get-watchlist-members" })
		.query(async ({ ctx, input }) => services.getWatchlistMembers(ctx, input)),

	// MUTATIONS
	create: protectedProcedure
		.input(inputs.createWatchlist)
		.meta({ name: "create-watchlist" })
		.mutation(async ({ ctx, input }) => services.createWatchlist(ctx, input)),

	like: protectedProcedure
		.input(inputs.likeWatchlist)
		.meta({ name: "like-watchlist" })
		.mutation(async ({ ctx, input }) => services.likeWatchlist(ctx, input)),

	updateEntryOrder: protectedProcedure
		.input(inputs.updateEntryOrder)
		.meta({ name: "update-entry-order" })
		.mutation(async ({ ctx, input }) => services.updateEntryOrder(ctx, input)),
} satisfies TRPCRouterRecord;
