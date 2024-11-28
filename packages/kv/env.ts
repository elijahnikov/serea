import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		UPSTASH_REDIS_REST_URL: z.string().min(1),
		UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
		NODE_ENV: z.enum(["development", "production"]).optional(),
	},
	client: {},
	experimental__runtimeEnv: {},
	skipValidation:
		!!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
