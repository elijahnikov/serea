import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./movies.input";
import * as service from "./movies.service";

export const moviesRouter = {
	// QUERIES

	// MUTATIONS
	addMovie: protectedProcedure
		.input(inputs.addMovie)
		.mutation(({ ctx, input }) => service.addMovie(ctx, input)),
} satisfies TRPCRouterRecord;
