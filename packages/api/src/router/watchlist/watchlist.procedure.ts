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

	update: protectedProcedure
		.input(inputs.updateWatchlist)
		.meta({ name: "update-watchlist" })
		.mutation(({ ctx, input }) => services.updateWatchlist(ctx, input)),

	updateTitle: protectedProcedure
		.input(inputs.updateWatchlistTitle)
		.meta({ name: "update-watchlist-title" })
		.mutation(({ ctx, input }) => services.updateTitle(ctx, input)),

	updateDescription: protectedProcedure
		.input(inputs.updateWatchlistDescription)
		.meta({ name: "update-watchlist-description" })
		.mutation(({ ctx, input }) => services.updateDescription(ctx, input)),

	updateTags: protectedProcedure
		.input(inputs.updateWatchlistTags)
		.meta({ name: "update-watchlist-tags" })
		.mutation(({ ctx, input }) => services.updateTags(ctx, input)),

	addEntry: protectedProcedure
		.input(inputs.addWatchlistEntry)
		.meta({ name: "add-watchlist-entry" })
		.mutation(({ ctx, input }) => services.addEntry(ctx, input)),

	clone: protectedProcedure
		.input(inputs.cloneWatchlist)
		.meta({ name: "clone-watchlist" })
		.mutation(({ ctx, input }) => services.cloneWatchlist(ctx, input)),

	deleteEntry: protectedProcedure
		.input(inputs.deleteWatchlistEntry)
		.meta({ name: "delete-watchlist-entry" })
		.mutation(({ ctx, input }) => services.deleteEntry(ctx, input)),

	toggleLike: protectedProcedure
		.input(inputs.toggleWatchlistLike)
		.meta({ name: "toggle-watchlist-like" })
		.mutation(({ ctx, input }) => services.toggleLike(ctx, input)),

	updateEntryOrder: protectedProcedure
		.input(inputs.updateEntryOrder)
		.meta({ name: "update-watchlist-entry-order" })
		.mutation(({ ctx, input }) => services.updateEntryOrder(ctx, input)),
} satisfies TRPCRouterRecord;
