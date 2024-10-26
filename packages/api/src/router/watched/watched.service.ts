"use server";

import {
	Watched,
	Watchlist,
	WatchlistEntries,
	WatchlistMember,
} from "@serea/db/schema";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	ToggleAllWatchedSchemaType,
	ToggleWatchedSchemaType,
} from "./watched.input";
import { and, eq } from "@serea/db";
import { TRPCError } from "@trpc/server";

export const toggleWatched = async (
	ctx: ProtectedTRPCContext,
	input: ToggleWatchedSchemaType,
) => {
	const currentUserId = ctx.session.user.id;

	const watchlist = await ctx.db.query.Watchlist.findFirst({
		where: and(eq(Watchlist.id, input.watchlistId)),
		with: {
			members: true,
		},
	});
	if (!watchlist) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Watchlist not found" });
	}
	const isMember = watchlist.members.some(
		(member) => member.userId === currentUserId,
	);
	if (!isMember) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You are not a member of this watchlist",
		});
	}

	const watched = await ctx.db.query.Watched.findFirst({
		where: and(
			eq(Watched.watchlistId, input.watchlistId),
			eq(Watched.entryId, input.entryId),
			eq(Watched.userId, currentUserId),
		),
	});

	if (!watched) {
		await ctx.db.insert(Watched).values({
			watchlistId: input.watchlistId,
			entryId: input.entryId,
			userId: currentUserId,
		});
		return { watched: true };
	}
	await ctx.db.delete(Watched).where(eq(Watched.id, watched.id));
	return { watched: false };
};

export const toggleAllWatched = async (
	ctx: ProtectedTRPCContext,
	input: ToggleAllWatchedSchemaType,
) => {
	const currentUserId = ctx.session.user.id;

	const watchlist = await ctx.db.query.Watchlist.findFirst({
		where: and(
			eq(Watchlist.id, input.watchlistId),
			eq(Watchlist.userId, currentUserId),
		),
	});
	if (!watchlist) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Watchlist not found" });
	}

	await ctx.db
		.delete(Watched)
		.where(and(eq(Watched.watchlistId, input.watchlistId)));

	const members = await ctx.db.query.WatchlistMember.findMany({
		where: eq(WatchlistMember.watchlistId, input.watchlistId),
	});
	const entries = await ctx.db.query.WatchlistEntries.findMany({
		where: eq(WatchlistEntries.watchlistId, input.watchlistId),
	});

	const userIds = members.map((member) => member.userId);

	await ctx.db.insert(Watched).values(
		userIds.map((userId) => ({
			watchlistId: input.watchlistId,
			entryId: input.entryId,
			userId,
		})),
	);

	return true;
};
