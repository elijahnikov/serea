import type { Role } from "@serea/db";
import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import { createNotification } from "../notification/notification.service";
import type {
	AddWatchlistEntryInput,
	CreateCommentInput,
	CreateWatchlistInput,
	DeleteCommentInput,
	DeleteEntryInput,
	DeleteInviteInput,
	DeleteMemberInput,
	GetWatchlistEntriesInput,
	GetWatchlistInput,
	InviteMembersInput,
	LikeCommentInput,
	LikeWatchlistInput,
	RespondInviteInput,
	UpdateEntryOrderInput,
	UpdateMemberRoleInput,
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
			members: !currentUserId ? false : { where: { userId: currentUserId } },
			likes: !currentUserId ? false : { where: { userId: currentUserId } },
			_count: {
				select: {
					entries: true,
					comments: true,
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
		isEditor: Boolean(
			watchlist.members.length > 0 &&
				ctx.session.user.id &&
				watchlist.members.some(
					(member) =>
						member.userId === ctx.session.user.id && member.role === "EDITOR",
				),
		),
		isOwner: Boolean(currentUserId === watchlist.userId),
		isMember: Boolean(watchlist.members.length > 0 && ctx.session.user.id),
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
			event: true,
			watched: {
				include: {
					user: {
						select: {
							id: true,
							name: true,
							image: true,
						},
					},
				},
			},
			_count: {
				select: {
					watched: true,
				},
			},
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
		orderBy: [
			{
				role: "asc",
			},
		],
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
					email: true,
				},
			},
		},
	});

	return members.sort((a, b) => {
		const roleOrder = { OWNER: 0, EDITOR: 1, VIEWER: 2 };
		return (roleOrder[a.role] ?? 3) - (roleOrder[b.role] ?? 3);
	});
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
	if (newEntry) {
		await ctx.db.watchlist.update({
			where: {
				id: input.watchlistId,
			},
			data: {
				updatedAt: new Date(),
			},
		});
	}

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

		await tx.watchlist.update({
			where: {
				id: input.watchlistId,
			},
			data: {
				updatedAt: new Date(),
			},
		});
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

export const inviteMembers = async (
	ctx: ProtectedTRPCContext,
	input: InviteMembersInput,
) => {
	const currentUserId = ctx.session.user.id;

	const watchlist = await ctx.db.watchlist.findUnique({
		where: { id: input.watchlistId },
		select: { title: true, id: true },
	});

	if (!watchlist) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Watchlist not found",
		});
	}

	const userToInvite = await ctx.db.user.findUnique({
		where: {
			email: input.email,
		},
	});

	if (!userToInvite) {
		return;
	}

	const member = await ctx.db.watchlistMember.findFirst({
		where: {
			userId: userToInvite.id,
			watchlistId: input.watchlistId,
		},
	});

	if (member) {
		return;
	}

	const invite = await ctx.db.watchlistInvite.create({
		data: {
			inviteeId: userToInvite.id,
			inviterId: currentUserId,
			watchlistId: input.watchlistId,
			role: input.role as Role,
			inviteeEmail: input.email,
		},
	});
	if (invite) {
		await createNotification(ctx, {
			userId: userToInvite.id,
			actorId: currentUserId,
			type: "WATCHLIST_INVITE",
			data: {
				watchlistId: watchlist.id,
				watchlistTitle: watchlist.title,
				inviteId: invite.id,
				role: input.role,
			},
		});
	}

	return invite;
};

export const getInvites = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistInput,
) => {
	const currentUserId = ctx.session.user.id;

	const owner = await ctx.db.watchlistMember.findFirst({
		where: {
			userId: currentUserId,
			watchlistId: input.id,
			role: "OWNER",
		},
	});

	if (!owner) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You are not the owner of this watchlist",
		});
	}

	const invites = await ctx.db.watchlistInvite.findMany({
		where: {
			watchlistId: input.id,
		},
		include: {
			invitee: {
				select: {
					name: true,
					image: true,
					id: true,
				},
			},
		},
	});

	return invites;
};

export const deleteInvite = async (
	ctx: ProtectedTRPCContext,
	input: DeleteInviteInput,
) => {
	const currentUserId = ctx.session.user.id;

	await ctx.db.watchlistInvite.delete({
		where: {
			id: input.inviteId,
			inviterId: currentUserId,
		},
	});

	await ctx.db.notification.deleteMany({
		where: {
			type: "WATCHLIST_INVITE",
			data: {
				path: ["inviteId"],
				equals: input.inviteId,
			},
		},
	});

	return {
		success: true,
	};
};

export const respondInvite = async (
	ctx: ProtectedTRPCContext,
	input: RespondInviteInput,
) => {
	const currentUserId = ctx.session.user.id;

	const invite = await ctx.db.watchlistInvite.findUnique({
		where: {
			id: input.inviteId,
			inviteeId: currentUserId,
		},
	});

	if (!invite) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Invite not found",
		});
	}

	if (input.response === "ACCEPT") {
		await ctx.db.watchlistMember.create({
			data: {
				userId: invite.inviteeId,
				watchlistId: invite.watchlistId,
				role: invite.role,
			},
		});
	}

	await ctx.db.watchlistInvite.delete({
		where: {
			id: input.inviteId,
		},
	});
	await ctx.db.notification.updateMany({
		where: {
			userId: invite.inviteeId,
			type: "WATCHLIST_INVITE",
			data: {
				path: ["inviteId"],
				equals: input.inviteId,
			},
		},
		data: {
			read: true,
		},
	});
};

export const deleteEntry = async (
	ctx: ProtectedTRPCContext,
	input: DeleteEntryInput,
) => {
	const entryToDelete = await ctx.db.watchlistEntry.findUnique({
		where: {
			id: input.entryId,
			watchlistId: input.watchlistId,
		},
		select: {
			order: true,
		},
	});

	if (!entryToDelete) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Entry not found",
		});
	}

	const deletedOrder = entryToDelete.order;

	return await ctx.db.$transaction(async (tx) => {
		await tx.watchlistEntry.delete({
			where: {
				id: input.entryId,
				watchlistId: input.watchlistId,
			},
		});

		await tx.watchlistEntry.updateMany({
			where: {
				watchlistId: input.watchlistId,
				order: {
					gt: deletedOrder,
				},
			},
			data: {
				order: {
					decrement: 1,
				},
			},
		});

		await tx.watchlist.update({
			where: {
				id: input.watchlistId,
			},
			data: {
				updatedAt: new Date(),
			},
		});

		return {
			success: true,
		};
	});
};

export const updateMemberRole = async (
	ctx: ProtectedTRPCContext,
	input: UpdateMemberRoleInput,
) => {
	const currentUserId = ctx.session.user.id;

	const isOwner = await ctx.db.watchlistMember.findFirst({
		where: {
			userId: currentUserId,
			watchlistId: input.watchlistId,
			role: "OWNER",
		},
	});

	if (!isOwner) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You are not the owner of this watchlist",
		});
	}

	await ctx.db.watchlistMember.update({
		where: {
			id: input.memberId,
			watchlistId: input.watchlistId,
		},
		data: {
			role: input.role as Role,
		},
	});

	return {
		success: true,
	};
};

export const deleteMember = async (
	ctx: ProtectedTRPCContext,
	input: DeleteMemberInput,
) => {
	const currentUserId = ctx.session.user.id;

	const isOwner = await ctx.db.watchlistMember.findFirst({
		where: {
			userId: currentUserId,
			watchlistId: input.watchlistId,
			role: "OWNER",
		},
	});

	if (!isOwner) {
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "You are not the owner of this watchlist",
		});
	}

	await ctx.db.watchlistMember.delete({
		where: {
			id: input.memberId,
			watchlistId: input.watchlistId,
		},
	});

	return {
		success: true,
	};
};
