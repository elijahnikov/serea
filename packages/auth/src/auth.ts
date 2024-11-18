import { db } from "@acme/db/client";
import { oAuthProxy } from "better-auth/plugins"
import { betterAuth, BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "../env";
import { expo } from "@better-auth/expo";

export const config = {
    database: drizzleAdapter(db, {
        provider: "pg"
    }),
    secret: env.AUTH_SECRET,
    plugins: [expo(), oAuthProxy()],
    socialProviders: {
        discord: {
            clientId: env.AUTH_DISCORD_ID,
            clientSecret: env.AUTH_DISCORD_SECRET,
            redirectURI: "http://localhost:3000/api/auth/callback/discord",
        }
    }
} satisfies BetterAuthOptions

export const auth = betterAuth(config);
export type Session = typeof auth.$Infer.Session
