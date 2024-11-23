import { watched } from "@serea/db/schema";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	ToggleAllWatchedInput,
	ToggleWatchedInput,
} from "./watched.input";
import { and, eq } from "@serea/db";
import { TRPCError } from "@trpc/server";

export const toggleWatched = async (
	ctx: ProtectedTRPCContext,
	input: ToggleWatchedInput,
) => {
	const currentUserId = ctx.session.user.id;

	const watchlist = await ctx.db.query.watchlist.findFirst({
		where: (table, { and, eq }) => and(eq(table.id, input.watchlistId)),
		with: {
			members: true,
		},
	});

	if (!watchlist) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Watchlist not found" });
	}
	const isMember = watchlist.members.find(
		(member) => member.userId === currentUserId,
	);
	if (!isMember) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You are not a member of this watchlist",
		});
	}

	const hasWatched = await ctx.db.query.watched.findFirst({
		where: (table, { and, eq }) =>
			and(
				eq(table.watchlistId, input.watchlistId),
				eq(table.entryId, input.entryId),
				eq(table.userId, currentUserId),
			),
	});

	if (!hasWatched) {
		if (isMember.id) {
			await ctx.db.insert(watched).values({
				watchlistId: input.watchlistId,
				entryId: input.entryId,
				userId: currentUserId,
				memberId: isMember.id,
			});
			return { watched: true };
		}
	} else {
		await ctx.db.delete(watched).where(eq(watched.id, hasWatched.id));
		return { watched: false };
	}
};

export const toggleAllWatched = async (
	ctx: ProtectedTRPCContext,
	input: ToggleAllWatchedInput,
) => {
	const currentUserId = ctx.session.user.id;

	const watchlist = await ctx.db.query.watchlist.findFirst({
		where: (table, { and, eq }) =>
			and(eq(table.id, input.watchlistId), eq(table.userId, currentUserId)),
	});
	if (!watchlist) {
		throw new Error("Watchlist not found");
	}

	await ctx.db
		.delete(watched)
		.where(
			and(
				eq(watched.watchlistId, input.watchlistId),
				eq(watched.entryId, input.entryId),
			),
		);

	const members = await ctx.db.query.member.findMany({
		where: (table, { eq }) => eq(table.watchlistId, input.watchlistId),
	});

	const userIds = members.map((member) => {
		return {
			userId: member.userId,
			memberId: member.id,
		};
	});

	await ctx.db.insert(watched).values(
		userIds.map((userId) => ({
			watchlistId: input.watchlistId,
			entryId: input.entryId,
			...userId,
		})),
	);

	return true;
};
