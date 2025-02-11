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

	// MUTATIONS
	create: protectedProcedure
		.input(inputs.createWatchlist)
		.meta({ name: "create-watchlist" })
		.mutation(async ({ ctx, input }) => services.createWatchlist(ctx, input)),
} satisfies TRPCRouterRecord;
