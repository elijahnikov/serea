import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../../trpc";

import { z } from "zod";
import * as inputs from "./tmdb.inputs";
import * as services from "./tmdb.service";

export const tmdbRouter = {
	trendingThisWeek: publicProcedure
		.meta({ name: "trending-this-week" })
		.query(services.trendingThisWeek),

	movieSearch: publicProcedure
		.meta({ name: "movie-search" })
		.input(inputs.movieSearch)
		.query(({ input }) => services.movieSearch(input)),

	getWatchProviders: publicProcedure
		.meta({ name: "get-watch-providers" })
		.input(inputs.watchProviders)
		.query(({ input }) => services.getWatchProviders(input)),
} satisfies TRPCRouterRecord;
