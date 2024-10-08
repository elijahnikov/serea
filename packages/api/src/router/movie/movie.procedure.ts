import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "../../trpc";
import * as services from "./movie.service";
import { movieTableSchema } from "@serea/validators";

export const movieRouter = {
	add: protectedProcedure
		.input(movieTableSchema.omit({ order: true }))
		.mutation(({ ctx, input }) => services.createMovie(ctx, input)),
} satisfies TRPCRouterRecord;
