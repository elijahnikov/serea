import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../../trpc";
import * as services from "./auth.service";

export const authRouter = {
	getSession: publicProcedure.query(({ ctx }) => {
		return ctx.session;
	}),
	getSecretMessage: protectedProcedure.query(() => {
		return "you can see this secret message!";
	}),
	signOut: protectedProcedure.mutation(async ({ ctx }) =>
		services.signOut(ctx),
	),
} satisfies TRPCRouterRecord;
