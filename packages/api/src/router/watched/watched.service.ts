import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type { CreateWatched, CreateWatchedForAll } from "./watched.input";

export const createWatched = async (
	ctx: ProtectedTRPCContext,
	input: CreateWatched,
) => {
	const currentUserId = ctx.session?.user.id;

	const memberData = await ctx.db.watchlistMember.findFirst({
		where: {
			userId: currentUserId,
			watchlistId: input.watchlistId,
		},
	});

	if (!memberData) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Member not found",
		});
	}

	const watched = await ctx.db.watched.findFirst({
		where: {
			userId: currentUserId,
			watchlistId: input.watchlistId,
			entryId: input.entryId,
			memberId: memberData.id,
		},
	});

	if (watched) {
		await ctx.db.watched.delete({
			where: { id: watched.id },
		});

		return {
			success: true,
		};
	}

	await ctx.db.watched.create({
		data: {
			userId: currentUserId,
			watchlistId: input.watchlistId,
			memberId: memberData.id,
			entryId: input.entryId,
		},
	});

	return {
		success: true,
	};
};

export const createWatchedForAll = async (
	ctx: ProtectedTRPCContext,
	input: CreateWatchedForAll,
) => {
	const watchlistMembers = await ctx.db.watchlistMember.findMany({
		where: {
			watchlistId: input.watchlistId,
		},
	});

	const existingWatched = await ctx.db.watched.findMany({
		where: {
			watchlistId: input.watchlistId,
			entryId: input.entryId,
		},
	});

	const alreadyWatchedMemberIds = new Set(
		existingWatched.map((watched) => watched.memberId),
	);
	const membersToCreate = watchlistMembers.filter(
		(member) => !alreadyWatchedMemberIds.has(member.id),
	);

	if (membersToCreate.length > 0) {
		await ctx.db.watched.createMany({
			data: membersToCreate.map((member) => ({
				userId: member.userId,
				watchlistId: input.watchlistId,
				memberId: member.id,
				entryId: input.entryId,
			})),
		});
	}

	return {
		success: true,
		createdCount: membersToCreate.length,
		skippedCount: alreadyWatchedMemberIds.size,
	};
};
