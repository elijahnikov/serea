import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./watch-event.input";
import * as services from "./watch-event.service";

export const watchEventRouter = {
	// QUERIES
	getEvent: protectedProcedure
		.input(inputs.getEvent)
		.meta({ name: "get-event" })
		.query(async ({ ctx, input }) => services.getEvent(ctx, input)),

	getEventsForWatchlist: protectedProcedure
		.input(inputs.getWatchEventForWatchlist)
		.meta({ name: "get-events-for-watchlist" })
		.query(async ({ ctx, input }) =>
			services.getEventsForWatchlist(ctx, input),
		),

	getAllEventsForWatchlist: protectedProcedure
		.input(inputs.getWatchEventForWatchlist)
		.meta({ name: "get-all-events-for-watchlist" })
		.query(async ({ ctx, input }) =>
			services.getAllEventsForWatchlist(ctx, input),
		),
	// MUTATIONS
	create: protectedProcedure
		.input(inputs.createWatchEvent)
		.meta({ name: "create-watch-event" })
		.mutation(async ({ ctx, input }) => services.createWatchEvent(ctx, input)),

	delete: protectedProcedure
		.input(inputs.deleteWatchEvent)
		.meta({ name: "delete-watch-event" })
		.mutation(async ({ ctx, input }) => services.deleteWatchEvent(ctx, input)),
} satisfies TRPCRouterRecord;
