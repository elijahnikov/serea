import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";
import * as inputs from "./members.input";
export const membersRouter = {
	// QUERIES
	listMembers: protectedProcedure
		.input(inputs.listMembers)
		.query(({ ctx, input }) => {}),

	listInvites: protectedProcedure
		.input(inputs.listInvites)
		.query(({ ctx, input }) => {}),

	listInvitesForUser: protectedProcedure.query(({ ctx, input }) => {}),

	getMemberRole: protectedProcedure
		.input(inputs.getMemberRole)
		.query(({ ctx, input }) => {}),

	// MUTATIONS
	invite: protectedProcedure
		.input(inputs.watchlistInvite)
		.mutation(({ ctx, input }) => {}),

	respond: protectedProcedure
		.input(inputs.respondToInvite)
		.mutation(({ ctx, input }) => {}),

	updateRole: protectedProcedure
		.input(inputs.updateRole)
		.mutation(({ ctx, input }) => {}),

	deleteMember: protectedProcedure
		.input(inputs.deleteMember)
		.mutation(({ ctx, input }) => {}),

	deleteInvite: protectedProcedure
		.input(inputs.deleteInvite)
		.mutation(({ ctx, input }) => {}),
} satisfies TRPCRouterRecord;
