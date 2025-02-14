import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	AddWatchlistEntryInput,
	CreateCommentInput,
	CreateWatchlistInput,
	DeleteCommentInput,
	GetWatchlistEntriesInput,
	GetWatchlistInput,
	LikeCommentInput,
	LikeWatchlistInput,
	UpdateEntryOrderInput,
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
				: { where: { userId: currentUserId, role: "EDITOR" } },
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
		isEditor: Boolean(watchlist.members.length > 0 && ctx.session.user.id),
		isOwner: Boolean(currentUserId === watchlist.userId),
	};
};

export const getWatchlistEntries = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistEntriesInput,
) => {
	const { limit = 60, cursor } = input;
	const entries = await ctx.db.watchlistEntry.findMany({
		take: limit + 1,
		cursor: cursor ? { order_id: cursor } : undefined,
		where: {
			watchlistId: input.watchlistId,
		},
		orderBy: [{ order: "asc" }, { id: "asc" }],
		include: {
			movie: true,
			watched: true,
		},
	});

	let nextCursor: typeof cursor | undefined;
	if (entries.length > limit) {
		const nextItem = entries.pop();
		if (nextItem != null) {
			nextCursor = {
				id: nextItem.id,
				order: nextItem.order,
			};
		}
	}

	return {
		entries,
		nextCursor,
	};
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

export const addEntry = async (
	ctx: ProtectedTRPCContext,
	input: AddWatchlistEntryInput,
) => {
	const currentUserId = ctx.session.user.id;

	const entry = await ctx.db.watchlistEntry.findFirst({
		where: {
			contentId: input.contentId,
			watchlistId: input.watchlistId,
		},
	});

	if (entry) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Entry already exists",
		});
	}

	const maxOrder = await ctx.db.watchlistEntry.aggregate({
		_max: {
			order: true,
		},
		where: {
			watchlistId: input.watchlistId,
		},
	});

	const newEntry = await ctx.db.watchlistEntry.create({
		data: {
			contentId: input.contentId,
			watchlistId: input.watchlistId,
			userId: currentUserId,
			order: (maxOrder._max.order ?? -1) + 1,
		},
	});

	return newEntry;
};

export const updateEntryOrder = async (
	ctx: ProtectedTRPCContext,
	input: UpdateEntryOrderInput,
) => {
	const currentEntryData = await ctx.db.watchlistEntry.findUnique({
		where: {
			id: input.entryId,
			watchlistId: input.watchlistId,
		},
	});
	if (!currentEntryData) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Entry not found",
		});
	}

	const oldOrder = currentEntryData.order;
	if (oldOrder === input.newOrder) {
		return currentEntryData;
	}

	return await ctx.db.$transaction(async (tx) => {
		if (oldOrder < input.newOrder) {
			await tx.watchlistEntry.updateMany({
				where: {
					watchlistId: input.watchlistId,
					order: {
						gt: oldOrder,
						lte: input.newOrder,
					},
				},
				data: {
					order: {
						decrement: 1,
					},
				},
			});
		} else {
			await tx.watchlistEntry.updateMany({
				where: {
					watchlistId: input.watchlistId,
					order: {
						gte: input.newOrder,
						lt: oldOrder,
					},
				},
				data: {
					order: {
						increment: 1,
					},
				},
			});
		}

		return await tx.watchlistEntry.update({
			where: {
				id: input.entryId,
			},
			data: {
				order: input.newOrder,
			},
		});
	});
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

export const createComment = async (
	ctx: ProtectedTRPCContext,
	input: CreateCommentInput,
) => {
	const currentUserId = ctx.session.user.id;

	const comment = await ctx.db.watchlistComment.create({
		data: {
			watchlistId: input.watchlistId,
			userId: currentUserId,
			parentId: input.parentId ?? null,
			content: input.content,
		},
	});

	return comment;
};

export const deleteComment = async (
	ctx: ProtectedTRPCContext,
	input: DeleteCommentInput,
) => {
	const currentUserId = ctx.session.user.id;

	await ctx.db.watchlistComment.delete({
		where: {
			id: input.commentId,
			userId: currentUserId,
		},
	});

	return {
		success: true,
	};
};

export const getComments = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistInput,
) => {
	const currentUserId = ctx.session.user.id;
	const comments = await ctx.db.watchlistComment.findMany({
		where: {
			watchlistId: input.id,
		},
		orderBy: {
			createdAt: "desc",
		},
		include: {
			likes: !currentUserId ? false : { where: { userId: currentUserId } },
			user: {
				select: {
					name: true,
					image: true,
					id: true,
				},
			},
			replies: {
				orderBy: {
					createdAt: "desc",
				},
				include: {
					_count: {
						select: {
							likes: true,
						},
					},
					likes: !currentUserId ? false : { where: { userId: currentUserId } },
					user: {
						select: {
							name: true,
							image: true,
							id: true,
						},
					},
				},
			},
			parent: {
				select: {
					id: true,
				},
			},
			_count: {
				select: {
					replies: true,
					likes: true,
				},
			},
		},
	});

	return comments.map((comment) => ({
		...comment,
		liked: Boolean(comment.likes.length > 0 && ctx.session.user.id),
		isOwner: comment.userId === ctx.session.user.id,
		replies: comment.replies.map((reply) => ({
			...reply,
			liked: Boolean(reply.likes.length > 0 && ctx.session.user.id),
		})),
	}));
};

export const likeComment = async (
	ctx: ProtectedTRPCContext,
	input: LikeCommentInput,
) => {
	const currentUserId = ctx.session.user.id;
	const data = { commentId: input.commentId, userId: currentUserId };

	const like = await ctx.db.watchlistCommentLike.findUnique({
		where: {
			userId_commentId: data,
		},
	});

	if (!like) {
		await ctx.db.watchlistCommentLike.create({
			data,
		});
		return {
			liked: true,
		};
	}

	await ctx.db.watchlistCommentLike.delete({
		where: {
			userId_commentId: data,
		},
	});

	return {
		liked: false,
	};
};
