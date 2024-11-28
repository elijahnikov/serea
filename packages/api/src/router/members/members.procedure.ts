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

	// MUTATIONS
	invite: protectedProcedure
		.input(inputs.watchlistInvite)
		.meta({ name: "create-invite" })
		.mutation(({ ctx, input }) => services.createInvite(ctx, input)),

	respond: protectedProcedure
		.input(inputs.respondToInvite)
		.meta({ name: "respond-to-invite" })
		.mutation(({ ctx, input }) => services.respondToInvite(ctx, input)),

	updateRole: protectedProcedure
		.input(inputs.updateRole)
		.meta({ name: "update-role" })
		.mutation(({ ctx, input }) => services.updateRole(ctx, input)),

	deleteMember: protectedProcedure
		.input(inputs.deleteMember)
		.meta({ name: "delete-member" })
		.mutation(({ ctx, input }) => services.deleteMember(ctx, input)),

	deleteInvite: protectedProcedure
		.input(inputs.deleteInvite)
		.meta({ name: "delete-invite" })
		.mutation(({ ctx, input }) => services.deleteInvite(ctx, input)),
} satisfies TRPCRouterRecord;
