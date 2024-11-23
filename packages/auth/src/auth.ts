import { db } from "@serea/db/client";
import { emailOTP, oAuthProxy } from "better-auth/plugins";
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { env } from "../env";
import { expo } from "@better-auth/expo";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const config = {
	database: drizzleAdapter(db, {
		provider: "pg",
	}),
	secret: env.AUTH_SECRET,
	plugins: [
		expo(),
		oAuthProxy(),
		emailOTP({
			async sendVerificationOTP({ email, otp, type }) {
				await resend.emails.send({
					from: '"Recall" <noreply@recalld.co>',
					to: email,
					subject: "Login to Serea",
					react: `Your code is ${otp}`,
				});
			},
		}),
	],
	socialProviders: {
		discord: {
			clientId: env.AUTH_DISCORD_ID,
			clientSecret: env.AUTH_DISCORD_SECRET,
			redirectURI: "http://localhost:3000/api/auth/callback/discord",
		},
		google: {
			clientId: env.AUTH_GOOGLE_ID,
			clientSecret: env.AUTH_GOOGLE_SECRET,
			redirectURI: "http://localhost:3000/api/auth/callback/google",
		},
	},
} satisfies BetterAuthOptions;

export const auth = betterAuth(config);
export type Session = typeof auth.$Infer.Session;
