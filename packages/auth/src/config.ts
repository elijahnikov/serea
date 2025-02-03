import { skipCSRFCheck } from "@auth/core";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

import type {
	DefaultSession,
	NextAuthConfig,
	Session as NextAuthSession,
} from "next-auth";
import Discord from "next-auth/providers/discord";

import { db } from "@serea/db/client";

import { Account, Session, User } from "@serea/db/schema";
import { env } from "../env";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			onboarded?: boolean;
		} & DefaultSession["user"];
	}
}

const adapter = DrizzleAdapter(db, {
	usersTable: User,
	accountsTable: Account,
	sessionsTable: Session,
});

export const isSecureContext = env.NODE_ENV !== "development";

export const authConfig = {
	adapter,
	// In development, we need to skip checks to allow Expo to work
	...(!isSecureContext
		? {
				skipCSRFCheck: skipCSRFCheck,
				trustHost: true,
			}
		: {}),
	secret: env.AUTH_SECRET,
	providers: [Discord],
	callbacks: {
		session: async (opts) => {
			if (!("user" in opts))
				throw new Error("unreachable with session strategy");

			const userDetails = await db.query.User.findFirst({
				where: (table, { eq }) => eq(table.id, opts.user.id),
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
