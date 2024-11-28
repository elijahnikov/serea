import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./members.input";
import * as services from "./members.service";

export const membersRouter = {
	// QUERIES
	listMembers: protectedProcedure
		.input(inputs.listMembers)
		.query(({ ctx, input }) => services.listMembers(ctx, input)),

	listInvites: protectedProcedure
		.input(inputs.listInvites)
		.query(({ ctx, input }) => services.listInvites(ctx, input)),

	listInvitesForUser: protectedProcedure.query(({ ctx }) =>
		services.listInvitesForUser(ctx),
	),

	getMemberRole: protectedProcedure
		.input(inputs.getMemberRole)
		.query(({ ctx, input }) => {}),

	// MUTATIONS
	invite: protectedProcedure
		.input(inputs.watchlistInvite)
		.mutation(({ ctx, input }) => services.createInvite(ctx, input)),

	respond: protectedProcedure
		.input(inputs.respondToInvite)
		.mutation(({ ctx, input }) => services.respondToInvite(ctx, input)),

	updateRole: protectedProcedure
		.input(inputs.updateRole)
		.mutation(({ ctx, input }) => services.updateRole(ctx, input)),

	deleteMember: protectedProcedure
		.input(inputs.deleteMember)
		.mutation(({ ctx, input }) => services.deleteMember(ctx, input)),

	deleteInvite: protectedProcedure
		.input(inputs.deleteInvite)
		.mutation(({ ctx, input }) => services.deleteInvite(ctx, input)),
} satisfies TRPCRouterRecord;
