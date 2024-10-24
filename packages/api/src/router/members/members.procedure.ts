import type { TRPCRouterRecord } from "@trpc/server";
import * as inputs from "./members.input";
import * as services from "./members.service";
import { protectedProcedure } from "../../trpc";

export const membersRouter = {
	invite: protectedProcedure
		.meta({ name: "invite-to-watchlist" })
		.input(inputs.watchlistInviteSchema)
		.mutation(({ ctx, input }) => services.inviteToWatchlist(ctx, input)),

	deleteInvite: protectedProcedure
		.meta({ name: "delete-invite" })
		.input(inputs.deleteInviteSchema)
		.mutation(({ ctx, input }) => services.deleteInvite(ctx, input)),

	deleteMember: protectedProcedure
		.meta({ name: "delete-member" })
		.input(inputs.deleteMemberSchema)
		.mutation(({ ctx, input }) => services.deleteMember(ctx, input)),

	respond: protectedProcedure
		.meta({ name: "respond-to-invite" })
		.input(inputs.respondToInviteSchema)
		.mutation(({ ctx, input }) => services.respondToInvite(ctx, input)),

	updateRole: protectedProcedure
		.meta({ name: "update-role" })
		.input(inputs.updateRoleSchema)
		.mutation(({ ctx, input }) => services.updateRole(ctx, input)),

	listMembers: protectedProcedure
		.meta({ name: "list-members-of-watchlist" })
		.input(inputs.listMembersSchema)
		.query(({ ctx, input }) => services.listMembers(ctx, input)),

	listInvites: protectedProcedure
		.meta({ name: "list-invites-of-watchlist" })
		.input(inputs.listInvitesSchema)
		.query(({ ctx, input }) => services.listInvites(ctx, input)),

	listInvitesForUser: protectedProcedure
		.meta({ name: "list-invites-for-user" })
		.query(({ ctx }) => services.listInvitesForUser(ctx)),

	getMemberRole: protectedProcedure
		.meta({ name: "get-member-role" })
		.input(inputs.getMemberRoleSchema)
		.query(({ ctx, input }) => services.getMemberRole(ctx, input)),
} satisfies TRPCRouterRecord;
