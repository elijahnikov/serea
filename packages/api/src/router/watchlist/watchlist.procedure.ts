import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure, publicProcedure } from "../../trpc";
import * as services from "./watchlist.service";
import { movieTableSchema, watchlistCreateSchema } from "@serea/validators";

export const watchlistRouter = {
	create: protectedProcedure
		.meta({ name: "create-watchlist" })
		.input(watchlistCreateSchema)
		.mutation(({ ctx, input }) => services.createWatchlist(ctx, input)),
} satisfies TRPCRouterRecord;
