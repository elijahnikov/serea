import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./watch-event.input";
import * as services from "./watch-event.service";

export const watchEventRouter = {
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
