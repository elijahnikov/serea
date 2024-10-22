import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		UPSTASH_REDIS_REST_URL: z.string(),
		UPSTASH_REDIS_REST_TOKEN: z.string(),
		NODE_ENV: z.enum(["development", "production"]).optional(),
		TMDB_ACCESS_TOKEN: z.string(),
		APP_URL: z.string().url(),
	},
	client: {},
	experimental__runtimeEnv: {
		UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
		UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
		APP_URL: process.env.APP_URL,
	},
	skipValidation:
		!!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
