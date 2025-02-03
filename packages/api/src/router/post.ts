import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { eq } from "@serea/db";
import { Post } from "@serea/db/schema";
import { protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = {
	all: publicProcedure.query(({ ctx }) => {
		return ctx.db.query.Post.findMany({
			orderBy: (post, { desc }) => [desc(post.id)],
		});
	}),
	byId: publicProcedure
		.input(z.object({ id: z.string() }))
		.query(({ ctx, input }) => {
			return ctx.db.query.Post.findFirst({
				where: (table, { eq }) => eq(table.id, input.id),
			});
		}),
	create: protectedProcedure
		.input(z.object({ name: z.string() }))
		.mutation(({ ctx, input }) => {
			// return ctx.db.post.create({
			// 	data: { name: input.name, createdById: ctx.session.user.id },
			// });
			return ctx.db.insert(Post).values({
				title: input.name,
			});
		}),
	delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
		return ctx.db.delete(Post).where(eq(Post.id, input));
	}),
} satisfies TRPCRouterRecord;
