import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./comments.input";
import * as services from "./comments.service";

export const commentsRouter = {
	// QUERIES
	get: protectedProcedure
		.input(inputs.getComments)
		.query(({ ctx, input }) => services.getComments(ctx, input)),

	// MUTATIONS
	create: protectedProcedure
		.input(inputs.createComment)
		.meta({ name: "create-comment" })
		.mutation(({ ctx, input }) => services.createComment(ctx, input)),

	delete: protectedProcedure
		.input(inputs.deleteComment)
		.meta({ name: "delete-comment" })
		.mutation(({ ctx, input }) => services.deleteComment(ctx, input)),

	report: protectedProcedure
		.input(inputs.reportComment)
		.mutation(({ ctx, input }) => services.reportComment(ctx, input)),
} satisfies TRPCRouterRecord;
