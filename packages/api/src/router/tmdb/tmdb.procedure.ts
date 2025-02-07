import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../../trpc";

import { z } from "zod";
import * as services from "./tmdb.service";

export const tmdbRouter = {
	trendingThisWeek: publicProcedure
		.meta({ name: "trending-this-week" })
		.query(services.trendingThisWeek),

	movieSearch: publicProcedure
		.meta({ name: "movie-search" })
		.input(z.object({ query: z.string() }))
		.query(({ input }) => services.movieSearch(input.query)),
} satisfies TRPCRouterRecord;
