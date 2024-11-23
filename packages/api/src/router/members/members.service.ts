import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	CreateInviteInput,
	ListInvitesInput,
	ListMembersInput,
} from "./members.input";
import { invite, member } from "@serea/db/schema";

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
