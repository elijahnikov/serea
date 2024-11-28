import { type Session, getSession } from "@serea/auth";
import { db } from "@serea/db/client";
import { client as RedisClient } from "@serea/kv";
/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1)
 * 2. You want to create a new middleware or type of procedure (see Part 3)
 *
 * tl;dr - this is where all the tRPC server stuff is created and plugged in.
 * The pieces you will need to use are documented accordingly near the end
 */
import { TRPCError, initTRPC } from "@trpc/server";
import { Ratelimit } from "@upstash/ratelimit";

import superjson from "superjson";
import { ZodError } from "zod";

const ratelimit = new Ratelimit({
	limiter: Ratelimit.fixedWindow(10, "10s"),
	redis: RedisClient,
});
/**
 * Isomorphic Session getter for API requests
 * - Expo requests will have a session token in the Authorization header
 * - Next.js requests will have a session token in cookies
 */
const isomorphicGetSession = async (headers: Headers) => {
	return await getSession();
};

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: {
	headers: Headers;
	session: Session | null;
}) => {
	const authToken = opts.headers.get("Authorization") ?? null;
	const session = await isomorphicGetSession(opts.headers);

	const ip = opts.headers.get("x-forwarded-for");
	const source = opts.headers.get("x-trpc-source") ?? "unknown";
	console.log(">>> tRPC Request from", source, "by", session?.user);

	return {
		ip,
		session,
		db,
		token: authToken,
	};
};

/**
 * 2. INITIALIZATION
 *
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter: ({ shape, error }) => ({
		...shape,
		data: {
			...shape.data,
			zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
		},
	}),
});

/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an articifial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
	const start = Date.now();

	const result = await next();

	const end = Date.now();
	console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

	return result;
});

const loggingMiddleware = t.middleware(async ({ next, input, meta }) => {
	const result = await next({ ctx: undefined });

	if (process.env.NODE_ENV === "development") {
		typeof meta !== "undefined" &&
			"name" in meta &&
			console.log(`[TRPC] -> ${meta.name} called`);
		console.log("Input ->", input);
		console.log("Result ->", result.ok === true ? result.data : result.error);
		console.log("Metadata ->", meta);

		return result;
	}

	return result;
});

const rateLimitingMiddleware = t.middleware(async ({ next, meta, ctx }) => {
	const ip = ctx.ip;

	if (typeof meta !== "undefined" && "name" in meta) {
		const { success, remaining } = await ratelimit.limit(`${ip}-${meta.name}`);

		if (!success) {
			throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
		}

		return next({
			ctx: {
				ratelimit: {
					remaining,
				},
			},
		});
	}
	return next({ ctx: undefined });
});

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
	.use(timingMiddleware)
	.use(loggingMiddleware)
	.use(rateLimitingMiddleware)
	.use(({ ctx, next }) => {
		if (!ctx.session?.user) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				// infers the `session` as non-nullable
				session: { ...ctx.session, user: ctx.session.user },
			},
		});
	});

export type TPRCContext = Awaited<ReturnType<typeof createTRPCContext>>;
export type ProtectedTRPCContext = TPRCContext & {
	session: {
		session: NonNullable<TPRCContext["session"]>["session"];
		user: NonNullable<TPRCContext["session"]>["user"];
	};
};
