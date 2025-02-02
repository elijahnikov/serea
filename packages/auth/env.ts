import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		AUTH_DISCORD_ID: z.string().min(1),
		AUTH_DISCORD_SECRET: z.string().min(1),
		AUTH_SECRET:
			process.env.NODE_ENV === "production"
				? z.string().min(1)
				: z.string().min(1).optional(),
		TMDB_ACCESS_TOKEN: z.string().min(1),
		NODE_ENV: z.enum(["development", "production"]).optional(),
	},
	client: {},
	experimental__runtimeEnv: {},
	skipValidation:
		!!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
