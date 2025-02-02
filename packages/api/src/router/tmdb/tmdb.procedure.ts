import type { TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../../trpc";

import * as services from "./tmdb.service";

export const tmdbRouter = {
	trendingThisWeek: publicProcedure
		.meta({ name: "trending-this-week" })
		.query(services.trendingThisWeek),
} satisfies TRPCRouterRecord;
