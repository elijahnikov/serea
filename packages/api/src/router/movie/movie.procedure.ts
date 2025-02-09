import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as input from "./movie.input";
import * as service from "./movie.service";

export const movieRouter = {
	add: protectedProcedure
		.input(input.addMovie)
		.mutation(({ ctx, input }) => service.addMovie(ctx, input)),
} satisfies TRPCRouterRecord;
