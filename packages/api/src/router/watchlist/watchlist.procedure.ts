import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "../../trpc";
import * as services from "./watchlist.service";
import * as inputs from "./watchlist.input";
import { watchlistCreateSchema } from "@serea/validators";

export const watchlistRouter = {
	create: protectedProcedure
		.meta({ name: "create-watchlist" })
		.input(watchlistCreateSchema)
		.mutation(({ ctx, input }) => services.createWatchlist(ctx, input)),

	get: protectedProcedure
		.meta({ name: "get-watchlist-by-id" })
		.input(inputs.getWatchlistSchema)
		.query(({ ctx, input }) => services.getWatchlist(ctx, input)),

	getEntries: protectedProcedure
		.meta({ name: "get-watchlist-entries" })
		.input(inputs.getWatchlistEntriesSchema)
		.query(({ ctx, input }) => services.getWatchlistEntries(ctx, input)),

	deleteEntry: protectedProcedure
		.meta({ name: "delete-watchlist-entry" })
		.input(inputs.deleteWatchlistEntrySchema)
		.mutation(({ ctx, input }) => services.deleteWatchlistEntry(ctx, input)),

	addEntry: protectedProcedure
		.meta({ name: "add-watchlist-entry" })
		.input(inputs.addWatchlistEntrySchema)
		.mutation(({ ctx, input }) => services.addWatchlistEntry(ctx, input)),
} satisfies TRPCRouterRecord;
