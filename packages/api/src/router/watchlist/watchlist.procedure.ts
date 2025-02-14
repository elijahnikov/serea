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
		.input(inputs.getWatchlistEntries)
		.meta({ name: "get-watchlist-entries" })
		.query(async ({ ctx, input }) => services.getWatchlistEntries(ctx, input)),

	getMembers: protectedProcedure
		.input(inputs.getWatchlist)
		.meta({ name: "get-watchlist-members" })
		.query(async ({ ctx, input }) => services.getWatchlistMembers(ctx, input)),

	getComments: protectedProcedure
		.input(inputs.getWatchlist)
		.meta({ name: "get-watchlist-comments" })
		.query(async ({ ctx, input }) => services.getComments(ctx, input)),

	// MUTATIONS
	create: protectedProcedure
		.input(inputs.createWatchlist)
		.meta({ name: "create-watchlist" })
		.mutation(async ({ ctx, input }) => services.createWatchlist(ctx, input)),

	like: protectedProcedure
		.input(inputs.likeWatchlist)
		.meta({ name: "like-watchlist" })
		.mutation(async ({ ctx, input }) => services.likeWatchlist(ctx, input)),

	addEntry: protectedProcedure
		.input(inputs.addWatchlistEntry)
		.meta({ name: "add-watchlist-entry" })
		.mutation(async ({ ctx, input }) => services.addEntry(ctx, input)),

	updateEntryOrder: protectedProcedure
		.input(inputs.updateEntryOrder)
		.meta({ name: "update-entry-order" })
		.mutation(async ({ ctx, input }) => services.updateEntryOrder(ctx, input)),

	createComment: protectedProcedure
		.input(inputs.createComment)
		.meta({ name: "create-comment" })
		.mutation(async ({ ctx, input }) => services.createComment(ctx, input)),

	deleteComment: protectedProcedure
		.input(inputs.deleteComment)
		.meta({ name: "delete-comment" })
		.mutation(async ({ ctx, input }) => services.deleteComment(ctx, input)),

	likeComment: protectedProcedure
		.input(inputs.likeComment)
		.meta({ name: "like-comment" })
		.mutation(async ({ ctx, input }) => services.likeComment(ctx, input)),
} satisfies TRPCRouterRecord;
