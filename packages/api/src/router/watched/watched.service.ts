"use server";

import {
	Watched,
	Watchlist,
	WatchlistEntries,
	WatchlistMember,
} from "@serea/db/schema";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	GetWatchlistProgressSchemaType,
	GetWatchStatusSchemaType,
	ToggleAllWatchedSchemaType,
	ToggleWatchedSchemaType,
} from "./watched.input";
import { and, eq } from "@serea/db";
import { TRPCError } from "@trpc/server";
import { appRouter } from "../../root";

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

	const memberId = watchlist.members.find(
		(member) => member.userId === currentUserId,
	)?.id;
	if (!watched) {
		if (memberId) {
			await ctx.db.insert(Watched).values({
				watchlistId: input.watchlistId,
				entryId: input.entryId,
				userId: currentUserId,
				memberId,
			});
			return { watched: true };
		}
	} else {
		await ctx.db.delete(Watched).where(eq(Watched.id, watched.id));
		return { watched: false };
	}
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
		.where(
			and(
				eq(Watched.watchlistId, input.watchlistId),
				eq(Watched.entryId, input.entryId),
			),
		);

	const members = await ctx.db.query.WatchlistMember.findMany({
		where: eq(WatchlistMember.watchlistId, input.watchlistId),
	});

	const userIds = members.map((member) => {
		return {
			userId: member.userId,
			memberId: member.id,
		};
	});

	await ctx.db.insert(Watched).values(
		userIds.map((userId) => ({
			watchlistId: input.watchlistId,
			entryId: input.entryId,
			...userId,
		})),
	);

	return true;
};

export const getWatchStatus = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchStatusSchemaType,
) => {
	const currentUserId = ctx.session.user.id;

	const isMember = await ctx.db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.watchlistId, input.watchlistId),
			eq(WatchlistMember.userId, currentUserId),
		),
	});
	if (!isMember) {
		throw new TRPCError({ code: "UNAUTHORIZED", message: "Not a member." });
	}
	const watched = await ctx.db.query.Watched.findMany({
		where: and(
			eq(Watched.watchlistId, input.watchlistId),
			eq(Watched.entryId, input.entryId),
		),
		with: {
			user: {
				columns: {
					name: true,
					image: true,
					email: true,
				},
			},
		},
	});
	return watched;
};

export const getWatchlistProgress = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistProgressSchemaType,
) => {
	const watchlist = await ctx.db.query.Watchlist.findFirst({
		where: eq(Watchlist.id, input.watchlistId),
		columns: {
			entriesLength: true,
		},
	});
	if (!watchlist) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Watchlist not found" });
	}

	const members = await ctx.db.query.WatchlistMember.findMany({
		where: eq(WatchlistMember.watchlistId, input.watchlistId),
		with: {
			watched: {
				columns: {
					id: true,
				},
			},
			user: {
				columns: {
					id: true,
					name: true,
					image: true,
				},
			},
		},
	});
	return { members, entriesLength: watchlist.entriesLength ?? 0 };
};
