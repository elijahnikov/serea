import { and, eq } from "@serea/db";
import { invite, member } from "@serea/db/schema";
import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	CreateInviteInput,
	DeleteInviteInput,
	DeleteMemberInput,
	ListInvitesInput,
	ListMembersInput,
	RespondToInviteInput,
	UpdateRoleInput,
} from "./members.input";

export const listMembers = async (
	ctx: ProtectedTRPCContext,
	input: ListMembersInput,
) => {
	const currentUserId = ctx.session.user.id;
	const isOwner = await ctx.db.query.watchlist.findFirst({
		where: (table, { eq, and }) =>
			and(eq(table.userId, currentUserId), eq(table.id, input.watchlistId)),
	});

	if (!isOwner) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	const members = await ctx.db.query.member.findMany({
		where: (table, { eq }) => eq(table.watchlistId, input.watchlistId),
		orderBy: (table, { desc }) => desc(table.createdAt),
		with: {
			user: {
				columns: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
		},
	});

	return members;
};

export const listInvites = async (
	ctx: ProtectedTRPCContext,
	input: ListInvitesInput,
) => {
	const currentUserId = ctx.session.user.id;
	const isOwner = await ctx.db.query.watchlist.findFirst({
		where: (table, { eq, and }) =>
			and(eq(table.userId, currentUserId), eq(table.id, input.watchlistId)),
	});

	if (!isOwner) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	const invites = await ctx.db.query.invite.findMany({
		where: (table, { eq }) => eq(table.watchlistId, input.watchlistId),
		orderBy: (table, { desc }) => desc(table.createdAt),
		with: {
			invitee: {
				columns: {
					id: true,
					name: true,
					email: true,
					image: true,
				},
			},
		},
	});

	return invites;
};

export const createInvite = async (
	ctx: ProtectedTRPCContext,
	input: CreateInviteInput,
) => {
	const currentUserId = ctx.session.user.id;

	const userToInvite = await ctx.db.query.user.findFirst({
		where: (table, { eq }) => eq(table.email, input.email),
	});

	if (!userToInvite) {
		throw new TRPCError({ code: "NOT_FOUND" });
	}

	const isUserAlreadyMember = await ctx.db.query.member.findFirst({
		where: (table, { eq, and }) =>
			and(
				eq(member.userId, userToInvite.id),
				eq(member.watchlistId, input.watchlistId),
			),
	});

	if (isUserAlreadyMember) {
		throw new Error("User is already a member of the watchlist");
	}

	const [createdInvite] = await ctx.db
		.insert(invite)
		.values({
			inviteeEmail: input.email,
			inviteeId: userToInvite.id,
			inviterId: currentUserId,
			watchlistId: input.watchlistId,
			role: input.role,
		})
		.returning();

	return createdInvite;
};

export const listInvitesForUser = async (ctx: ProtectedTRPCContext) => {
	const invites = await ctx.db.query.invite.findMany({
		where: (table, { eq }) => eq(table.inviteeId, ctx.session.user.id),
		with: {
			inviter: {
				columns: {
					name: true,
					email: true,
					image: true,
				},
			},
			watchlist: {
				columns: {
					id: true,
					title: true,
				},
			},
		},
	});
	return invites;
};

export const respondToInvite = async (
	ctx: ProtectedTRPCContext,
	input: RespondToInviteInput,
) => {
	const currentUserId = ctx.session.user.id;
	const invitation = await ctx.db.query.invite.findFirst({
		where: (table, { and, eq }) =>
			and(eq(table.id, input.invitationId), eq(table.inviteeId, currentUserId)),
	});

	if (!invitation) {
		throw new TRPCError({ code: "NOT_FOUND" });
	}

	if (input.response === "accept") {
		return await ctx.db.transaction(async (tx) => {
			await tx
				.insert(member)
				.values({
					userId: currentUserId,
					watchlistId: invitation.watchlistId,
					role: invitation.role,
				})
				.returning();

			await tx
				.delete(invite)
				.where(
					and(
						eq(invite.id, invitation.id),
						eq(invite.inviteeId, currentUserId),
					),
				);

			return { status: "accepted", watchlist: invitation.watchlistId };
		});
	}

	await ctx.db
		.delete(invite)
		.where(
			and(eq(invite.id, invitation.id), eq(invite.inviteeId, currentUserId)),
		);

	return { status: "declined" };
};

export const updateRole = async (
	ctx: ProtectedTRPCContext,
	input: UpdateRoleInput,
) => {
	const currentUserId = ctx.session.user.id;

	const [ownerCheck, targetMember] = await Promise.all([
		ctx.db.query.member.findFirst({
			where: (table, { and, eq }) =>
				and(
					eq(table.watchlistId, input.watchlistId),
					eq(table.userId, currentUserId),
					eq(table.role, "owner"),
				),
		}),
		ctx.db.query.member.findFirst({
			where: (table, { and, eq }) =>
				and(
					eq(table.watchlistId, input.watchlistId),
					eq(table.userId, input.memberId),
				),
		}),
	]);

	if (!ownerCheck) {
		throw new TRPCError({
			code: "UNAUTHORIZED",
			message: "You are not the owner of this watchlist",
		});
	}

	if (!targetMember) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Member not found",
		});
	}

	await ctx.db
		.update(member)
		.set({ role: input.role })
		.where(
			and(
				eq(member.watchlistId, input.watchlistId),
				eq(member.userId, input.memberId),
			),
		);

	return true;
};

export const deleteMember = async (
	ctx: ProtectedTRPCContext,
	input: DeleteMemberInput,
) => {
	await ctx.db
		.delete(member)
		.where(
			and(
				eq(member.watchlistId, input.watchlistId),
				eq(member.userId, input.memberId),
			),
		);

	return true;
};

export const deleteInvite = async (
	ctx: ProtectedTRPCContext,
	input: DeleteInviteInput,
) => {
	const currentUserId = ctx.session.user.id;
	await ctx.db
		.delete(invite)
		.where(
			and(
				eq(invite.id, input.invitationId),
				eq(invite.inviterId, currentUserId),
			),
		);
	return true;
};
