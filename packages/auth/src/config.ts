import { skipCSRFCheck } from "@auth/core";
import { PrismaAdapter } from "@auth/prisma-adapter";

import type {
	DefaultSession,
	NextAuthConfig,
	Session as NextAuthSession,
} from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

import { db } from "@serea/db";

import { env } from "../env";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			onboarded?: boolean;
		} & DefaultSession["user"];
	}
}

const adapter = PrismaAdapter(db);

export const isSecureContext = env.NODE_ENV !== "development";

export const authConfig = {
	adapter,
	// In development, we need to skip checks to allow Expo to work
	...(!isSecureContext
		? {
				skipCSRFCheck,
				trustHost: true,
			}
		: {}),
	secret: env.AUTH_SECRET,
	providers: [Discord, Google],
	callbacks: {
		session: async (opts) => {
			if (!("user" in opts))
				throw new Error("unreachable with session strategy");

			const userDetails = await db.user.findFirst({
				where: {
					id: opts.user.id,
				},
			});

			return {
				...opts.session,
				user: {
					...opts.session.user,
					id: opts.user.id,
					onboarded: userDetails?.onboarded,
				},
			};
		},
	},
} satisfies NextAuthConfig;

export const validateToken = async (
	token: string,
): Promise<NextAuthSession | null> => {
	const sessionToken = token.slice("Bearer ".length);
	const session = await adapter.getSessionAndUser?.(sessionToken);
	return session
		? {
				user: {
					...session.user,
				},
				expires: session.session.expires.toISOString(),
			}
		: null;
};

export const invalidateSessionToken = async (token: string) => {
	const sessionToken = token.slice("Bearer ".length);
	await adapter.deleteSession?.(sessionToken);
};
