import { auth } from "@serea/auth";
import { db } from "@serea/db/client";
import {
	DEFAULT_SERVER_ERROR_MESSAGE,
	createSafeActionClient,
} from "next-safe-action";
import { z } from "zod";

export const actionClient = createSafeActionClient({
	handleServerError(e) {
		if (e instanceof Error) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
});

export const actionClientWithMeta = createSafeActionClient({
	handleServerError(e) {
		if (e instanceof Error) {
			return e.message;
		}

		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
	defineMetadataSchema() {
		return z.object({
			name: z.string(),
			track: z
				.object({
					event: z.string(),
					channel: z.string(),
				})
				.optional(),
		});
	},
});

export const authActionClient = actionClientWithMeta
	.use(async ({ next, clientInput, metadata }) => {
		const result = await next({ ctx: undefined });

		if (process.env.NODE_ENV === "development") {
			console.log("Input ->", clientInput);
			console.log("Result ->", result.data);
			console.log("Metadata ->", metadata);

			return result;
		}

		return result;
	})
	.use(async ({ next }) => {
		// TO-DO: Add rate limiting
		return next();
	})
	.use(async ({ next }) => {
		const session = await auth();

		if (!session) {
			throw new Error("Unauthorized");
		}
		if (!session.user) {
			throw new Error("Unauthorized");
		}

		return next({
			ctx: {
				db,
				session,
			},
		});
	});
