import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
	all: publicProcedure.query(({ ctx }) => {
		return ctx.db.post.findMany({ orderBy: { id: "desc" } });
	}),
	byId: publicProcedure
		.input(z.object({ id: z.number() }))
		.query(({ ctx, input }) => {
			return ctx.db.post.findFirst({ where: { id: input.id } });
		}),
	create: protectedProcedure
		.input(z.object({ name: z.string() }))
		.mutation(({ ctx, input }) => {
			return ctx.db.post.create({
				data: { name: input.name, createdById: ctx.session.user.id },
			});
		}),
	delete: protectedProcedure.input(z.number()).mutation(({ ctx, input }) => {
		return ctx.db.post.delete({ where: { id: input } });
	}),
} satisfies TRPCRouterRecord;
