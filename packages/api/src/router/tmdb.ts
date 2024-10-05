import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { publicProcedure } from "../trpc";
import { TMDB_API_URLS } from "../utils/contants";
import type { ZodSchema } from "zod";
import { trendingMoviesSchema } from "@serea/validators";
import { env } from "../../env";
const fetchTemplate = async <T>(
	url: string,
	schema: ZodSchema<T>,
): Promise<T> => {
	const response = await fetch(TMDB_API_URLS.trendingThisWeek, {
		headers: {
			accept: "application/json",
			Authorization: `Bearer ${env.TMDB_ACCESS_TOKEN}`,
		},
	});
	if (!response.ok) {
		throw new TRPCError({ code: "BAD_REQUEST" });
	}
	const data = await response.json();
	const validated = schema.parse(data);
	return validated;
};

export const tmdbRouter = {
	trendingThisWeek: publicProcedure.query(async () => {
		return fetchTemplate(TMDB_API_URLS.trendingThisWeek, trendingMoviesSchema);
	}),
} satisfies TRPCRouterRecord;
