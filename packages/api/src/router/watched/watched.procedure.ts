import type { TRPCRouterRecord } from "@trpc/server";
import * as inputs from "./watched.input";
import * as services from "./watched.service";
import { protectedProcedure } from "../../trpc";

export const watchedRouter = {
	toggle: protectedProcedure
		.meta({ name: "toggle-watched" })
		.input(inputs.toggleWatchedSchema)
		.mutation(({ ctx, input }) => services.toggleWatched(ctx, input)),

	toggleAll: protectedProcedure
		.meta({ name: "toggle-all-watched" })
		.input(inputs.toggleAllWatchedSchema)
		.mutation(({ ctx, input }) => services.toggleAllWatched(ctx, input)),

	getWatchStatus: protectedProcedure
		.meta({ name: "get-watch-status" })
		.input(inputs.getWatchStatusSchema)
		.query(({ ctx, input }) => services.getWatchStatus(ctx, input)),
} satisfies TRPCRouterRecord;
