import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./watched.input";
import * as services from "./watched.service";

export const watchedRouter = {
	// MUTATIONS
	create: protectedProcedure
		.input(inputs.createWatched)
		.meta({ name: "create-watched" })
		.mutation(async ({ ctx, input }) => services.createWatched(ctx, input)),

	createForAll: protectedProcedure
		.input(inputs.createWatchedForAll)
		.meta({ name: "create-watched-for-all" })
		.mutation(async ({ ctx, input }) =>
			services.createWatchedForAll(ctx, input),
		),
} satisfies TRPCRouterRecord;
