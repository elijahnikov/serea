import type { TRPCRouterRecord } from "@trpc/server";
import * as inputs from "./movies.input";
import { protectedProcedure } from "../../trpc";

export const moviesRouter = {
	// QUERIES

	// MUTATIONS
	addMovie: protectedProcedure
		.input(inputs.addMovie)
		.mutation(({ ctx, input }) => {}),
} satisfies TRPCRouterRecord;
