import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	CreateWatchlistInput,
	GetWatchlistInput,
	LikeWatchlistInput,
} from "./watchlist.input";

export const createWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: CreateWatchlistInput,
) => {
	const currentUserId = ctx.session.user.id;

	const watchlist = await ctx.db.watchlist.create({
		data: {
			...input,
			hideStats: input.hideStats,
			userId: currentUserId,
			numberOfEntries: input.entries.length ?? 0,
			entries: {
				create: input.entries.map((entry) => ({
					contentId: entry.contentId,
					order: entry.order,
					userId: currentUserId,
				})),
			},
			members: {
				create: {
					userId: currentUserId,
					role: "OWNER",
				},
			},
		},
		select: {
			id: true,
		},
	});

	return watchlist;
};

export const getWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistInput,
) => {
	const currentUserId = ctx.session.user.id;
	const watchlist = await ctx.db.watchlist.findFirst({
		where: {
			id: input.id,
		},
		include: {
			user: {
				select: {
					name: true,
					image: true,
					id: true,
				},
			},
			members: !currentUserId
				? false
				: { where: { userId: currentUserId, role: "OWNER" } },
			likes: !currentUserId ? false : { where: { userId: currentUserId } },
			_count: {
				select: {
					entries: true,
					members: true,
					likes: true,
				},
			},
		},
	});
	if (!watchlist) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Watchlist not found",
		});
	}

	return {
		...watchlist,
		liked: Boolean(watchlist.likes.length > 0 && ctx.session.user.id),
		isOwner: Boolean(watchlist.members.length > 0 && ctx.session.user.id),
	};
};

export const getWatchlistEntries = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistInput,
) => {
	const entries = await ctx.db.watchlistEntry.findMany({
		where: {
			watchlistId: input.id,
		},
		include: {
			movie: true,
			watched: true,
		},
	});

	return entries;
};

export const getWatchlistMembers = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistInput,
) => {
	const members = await ctx.db.watchlistMember.findMany({
		where: {
			watchlistId: input.id,
		},
		include: {
			_count: {
				select: {
					watched: true,
				},
			},
			user: {
				select: {
					name: true,
					image: true,
					id: true,
				},
			},
		},
	});

	return members;
};

export const likeWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: LikeWatchlistInput,
) => {
	const currentUserId = ctx.session.user.id;
	const data = { watchlistId: input.id, userId: currentUserId };

	const like = await ctx.db.watchlistLike.findUnique({
		where: {
			userId_watchlistId: data,
		},
	});

	if (!like) {
		await ctx.db.watchlistLike.create({
			data,
		});
		return {
			liked: true,
		};
	}

	await ctx.db.watchlistLike.delete({
		where: {
			userId_watchlistId: data,
		},
	});

	return {
		liked: false,
	};
};
