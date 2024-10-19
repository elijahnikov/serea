import {
	User,
	Watchlist,
	WatchlistInvitation,
	WatchlistMember,
} from "@serea/db/schema";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	DeleteInviteSchemaType,
	DeleteMemberSchemaType,
	GetMemberRoleSchemaType,
	ListMembersSchemaType,
	RespondToInviteSchemaType,
	UpdateRoleSchemaType,
	WatchlistInviteSchemaType,
} from "./members.input";
import { and, desc, eq } from "@serea/db";
import { TRPCError } from "@trpc/server";

export const inviteToWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: WatchlistInviteSchemaType,
) => {
	const currentUserId = ctx.session.user.id;

	const userToInvite = await ctx.db.query.User.findFirst({
		where: eq(User.email, input.inviteeEmail),
	});

	if (!userToInvite) {
		throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
	}

	const isUserAlreadyMember = await ctx.db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.userId, userToInvite.id),
			eq(WatchlistMember.watchlistId, input.watchlistId),
		),
	});

	if (isUserAlreadyMember) {
		throw new TRPCError({ code: "FORBIDDEN" });
	}

	const [invite] = await ctx.db
		.insert(WatchlistInvitation)
		.values({
			inviteeEmail: userToInvite?.email,
			inviteeId: userToInvite?.id,
			watchlistId: input.watchlistId,
			inviterId: currentUserId,
			role: input.role,
		})
		.returning();

	return invite;
};

export const deleteInvite = async (
	ctx: ProtectedTRPCContext,
	input: DeleteInviteSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	await ctx.db
		.delete(WatchlistInvitation)
		.where(
			and(
				eq(WatchlistInvitation.id, input.invitationId),
				eq(WatchlistInvitation.inviterId, currentUserId),
			),
		);
	return true;
};

export const respondToInvite = async (
	ctx: ProtectedTRPCContext,
	input: RespondToInviteSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	const invitation = await ctx.db.query.WatchlistInvitation.findFirst({
		where: and(
			eq(WatchlistInvitation.id, input.invitationId),
			eq(WatchlistInvitation.inviteeId, currentUserId),
		),
	});

	if (!invitation) {
		throw new TRPCError({ code: "NOT_FOUND" });
	}

	if (input.response === "accept") {
		await ctx.db.insert(WatchlistMember).values({
			userId: currentUserId,
			watchlistId: invitation.watchlistId,
			role: invitation.role,
		});
	}

	await ctx.db
		.delete(WatchlistInvitation)
		.where(
			and(
				eq(WatchlistInvitation.id, invitation.id),
				eq(WatchlistInvitation.inviteeId, currentUserId),
			),
		);

	return true;
};

export const updateRole = async (
	ctx: ProtectedTRPCContext,
	input: UpdateRoleSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	const watchlist = await ctx.db.query.Watchlist.findFirst({
		where: eq(Watchlist.id, input.watchlistId),
	});

	if (!watchlist) {
		throw new TRPCError({ code: "NOT_FOUND" });
	}

	const owner = await ctx.db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.watchlistId, watchlist.id),
			eq(WatchlistMember.role, "owner"),
		),
	});
	if (!owner || owner.userId !== currentUserId) {
		throw new TRPCError({ code: "FORBIDDEN" });
	}

	const member = await ctx.db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.watchlistId, watchlist.id),
			eq(WatchlistMember.userId, input.memberId),
		),
	});

	if (!member) {
		throw new TRPCError({ code: "NOT_FOUND" });
	}

	await ctx.db
		.update(WatchlistMember)
		.set({ role: input.role })
		.where(
			and(
				eq(WatchlistMember.watchlistId, watchlist.id),
				eq(WatchlistMember.userId, input.memberId),
			),
		);

	return true;
};

export const listMembers = async (
	ctx: ProtectedTRPCContext,
	input: ListMembersSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	const isMemberOfWatchlist = await ctx.db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.userId, currentUserId),
			eq(WatchlistMember.watchlistId, input.watchlistId),
		),
	});
	if (!isMemberOfWatchlist) {
		throw new TRPCError({ code: "FORBIDDEN" });
	}

	const members = await ctx.db.query.WatchlistMember.findMany({
		where: eq(WatchlistMember.watchlistId, input.watchlistId),
		orderBy: desc(WatchlistMember.createdAt),
		with: {
			user: true,
		},
	});

	return members;
};

export const listInvites = async (
	ctx: ProtectedTRPCContext,
	input: ListMembersSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	const isOwnerOfWatchlist = await ctx.db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.userId, currentUserId),
			eq(WatchlistMember.watchlistId, input.watchlistId),
			eq(WatchlistMember.role, "owner"),
		),
	});
	if (!isOwnerOfWatchlist) {
		throw new TRPCError({ code: "FORBIDDEN" });
	}

	const invites = await ctx.db.query.WatchlistInvitation.findMany({
		where: eq(WatchlistInvitation.watchlistId, input.watchlistId),
		orderBy: desc(WatchlistInvitation.createdAt),
		with: {
			invitee: true,
		},
	});

	return invites;
};

export const listInvitesForUser = async (ctx: ProtectedTRPCContext) => {
	const currentUserId = ctx.session.user.id;
	const invites = await ctx.db.query.WatchlistInvitation.findMany({
		where: eq(WatchlistInvitation.inviteeId, currentUserId),
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

export const deleteMember = async (
	ctx: ProtectedTRPCContext,
	input: DeleteMemberSchemaType,
) => {
	const currentUserId = ctx.session.user.id;

	await ctx.db
		.delete(WatchlistMember)
		.where(
			and(
				eq(WatchlistMember.watchlistId, input.watchlistId),
				eq(WatchlistMember.userId, input.memberId),
			),
		);

	return true;
};

export const getMemberRole = async (
	ctx: ProtectedTRPCContext,
	input: GetMemberRoleSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	const member = await ctx.db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.watchlistId, input.watchlistId),
			eq(WatchlistMember.userId, currentUserId),
		),
	});
	if (!member) {
		return "non-member";
	}

	return member.role;
};
