import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets";
import { z } from "zod";

export const env = createEnv({
	extends: [vercel()],
	server: {
		AUTH_DISCORD_ID: z.string().min(1),
		TMDB_ACCESS_TOKEN: z.string().min(1),
		BETTER_AUTH_URL: z.string().min(1),
		AUTH_DISCORD_SECRET: z.string().min(1),
		RESEND_API_KEY: z.string().min(1),
		AUTH_SECRET:
			process.env.NODE_ENV === "production"
				? z.string().min(1)
				: z.string().min(1).optional(),
		NODE_ENV: z.enum(["development", "production"]).optional(),
	},
	client: {},
	experimental__runtimeEnv: {},
	skipValidation:
		!!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
