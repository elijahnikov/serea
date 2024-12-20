import { createId } from "@paralleldrive/cuid2";
import { and, eq, gt, lt, sql } from "@serea/db";
import { entry, like, member, watchlist } from "@serea/db/schema";
import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	AddWatchlistEntryInput,
	CloneWatchlistInput,
	CreateWatchlistInput,
	DeleteWatchlistEntryInput,
	GetWatchlistEntriesInput,
	GetWatchlistInput,
	GetWatchlistLikesInput,
	ToggleLikeInput,
	UpdateEntryOrderInput,
	UpdateWatchlistDescriptionInput,
	UpdateWatchlistInput,
	UpdateWatchlistTagsInput,
	UpdateWatchlistTitleInput,
} from "./watchlist.input";

export const createWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: CreateWatchlistInput,
) => {
	const currentUserId = ctx.session.user.id;
	const id = createId();

	const [newWatchlist] = await ctx.db
		.insert(watchlist)
		.values({
			...input,
			id,
			userId: currentUserId,
			tags: input.tags.join(","),
			numberOfEntries: input.entries.length ?? 0,
		})
		.returning();

	if (!newWatchlist) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to create watchlist",
		});
	}

	await ctx.db.insert(member).values({
		watchlistId: newWatchlist.id,
		userId: currentUserId,
		role: "owner",
	});

	if (input.entries.length > 0) {
		await ctx.db.insert(entry).values(
			input.entries.map((entry) => ({
				...entry,
				watchlistId: newWatchlist.id,
				userId: currentUserId,
			})),
		);
	}

	return newWatchlist.id;
};

export const getWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistInput,
) => {
	const watchlist = await ctx.db.query.watchlist.findFirst({
		where: (table, { eq }) => eq(table.id, input.id),
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

	if (!watchlist) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Watchlist not found",
		});
	}

	return watchlist;
};

export const getWatchlistEntries = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistEntriesInput,
) => {
	const entries = await ctx.db.query.entry.findMany({
		where: (table, { eq }) => eq(table.watchlistId, input.id),
		with: {
			movie: true,
			watched: {
				with: {
					user: true,
				},
			},
		},
	});

	return entries;
};

export const getWatchlistLikes = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistLikesInput,
) => {
	const currentUserId = ctx.session.user.id;
	const likes = await ctx.db.query.like.findMany({
		where: (table, { eq, and }) =>
			and(eq(table.watchlistId, input.id), eq(table.userId, currentUserId)),
	});

	const likesCount =
		(await ctx.db
			.select({ count: sql`count(*)` })
			.from(like)
			.where(eq(like.watchlistId, input.id))
			.then((result) => Number(result[0]?.count))) ?? 0;

	return {
		count: likesCount,
		hasLiked: Boolean(likes.length > 0 && currentUserId),
	};
};

export const addEntry = async (
	ctx: ProtectedTRPCContext,
	input: AddWatchlistEntryInput,
) => {
	const currentUserId = ctx.session.user.id;

	const maxOrderResult = await ctx.db
		.select({ maxOrder: sql<number>`COALESCE(MAX(${entry.order}), 0)` })
		.from(entry)
		.where(eq(entry.watchlistId, input.watchlistId));

	const [watchlistAndEntry] = await ctx.db
		.select({
			watchlist: watchlist,
			entry: entry,
			maxOrder: sql<number>`MAX(${entry.order})`,
		})
		.from(watchlist)
		.leftJoin(
			entry,
			sql`${entry.watchlistId} = ${watchlist.id} AND ${entry.contentId} = ${input.contentId}`,
		)
		.where(eq(watchlist.id, input.watchlistId))
		.groupBy(watchlist.id, entry.id);

	if (!watchlistAndEntry?.watchlist) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Watchlist not found",
		});
	}

	if (watchlistAndEntry.entry) {
		return watchlistAndEntry.entry;
	}

	const newOrder = (maxOrderResult[0]?.maxOrder ?? 0) + 1;

	const [newEntry] = await ctx.db.transaction(async (tx) => {
		const [createdEntry] = await tx
			.insert(entry)
			.values({
				watchlistId: input.watchlistId,
				contentId: input.contentId,
				userId: currentUserId,
				order: newOrder,
			})
			.returning();

		await tx
			.update(watchlist)
			.set({
				updatedAt: new Date().toISOString(),
				numberOfEntries: sql`${watchlist.numberOfEntries} + 1`,
			})
			.where(eq(watchlist.id, input.watchlistId));

		return [createdEntry];
	});

	return newEntry;
};

export const deleteEntry = async (
	ctx: ProtectedTRPCContext,
	input: DeleteWatchlistEntryInput,
) => {
	const checkEntry = await ctx.db.query.entry.findFirst({
		where: (table, { eq }) => eq(table.id, input.entryId),
	});

	if (!checkEntry) {
		throw new Error("Entry not found");
	}

	const deletedOrder = entry.order;

	const [deleted] = await ctx.db
		.delete(entry)
		.where(
			and(
				eq(entry.watchlistId, input.watchlistId),
				eq(entry.id, input.entryId),
			),
		)
		.returning();

	if (!deleted) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Could not delete entry",
		});
	}

	const [deletedEntry] = await ctx.db
		.update(entry)
		.set({ order: sql`${entry.order} - 1` })
		.where(
			and(
				eq(entry.watchlistId, input.watchlistId),
				gt(entry.order, deletedOrder),
			),
		)
		.returning();

	if (deletedEntry) {
		await ctx.db
			.update(watchlist)
			.set({
				updatedAt: new Date().toISOString(),
				numberOfEntries: sql`${watchlist.numberOfEntries} - 1`,
			})
			.where(eq(watchlist.id, input.watchlistId));
	}

	return true;
};

export const updateEntryOrder = async (
	ctx: ProtectedTRPCContext,
	input: UpdateEntryOrderInput,
) => {
	const currentEntry = await ctx.db.query.entry.findFirst({
		where: (table, { eq, and }) =>
			and(
				eq(table.id, input.entryId),
				eq(table.watchlistId, input.watchlistId),
			),
	});

	if (!currentEntry) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Entry not found",
		});
	}

	const oldOrder = currentEntry.order;

	if (input.newOrder > oldOrder) {
		await ctx.db
			.update(entry)
			.set({ order: sql`${entry.order} - 1` })
			.where(
				and(
					eq(entry.watchlistId, input.watchlistId),
					gt(entry.order, oldOrder),
					lt(entry.order, input.newOrder + 1),
				),
			);
	} else if (input.newOrder < oldOrder) {
		await ctx.db
			.update(entry)
			.set({ order: sql`${entry.order} + 1` })
			.where(
				and(
					eq(entry.watchlistId, input.watchlistId),
					lt(entry.order, oldOrder),
					gt(entry.order, input.newOrder - 1),
				),
			);
	}

	const [updatedEntry] = await ctx.db.transaction(async (tx) => {
		const [updatedEntry] = await tx
			.update(entry)
			.set({ order: input.newOrder })
			.where(
				and(
					eq(entry.id, input.entryId),
					eq(entry.watchlistId, input.watchlistId),
				),
			)
			.returning();

		await tx
			.update(watchlist)
			.set({ updatedAt: new Date().toISOString() })
			.where(eq(watchlist.id, input.watchlistId));

		return [updatedEntry];
	});

	if (!updatedEntry) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to update entry order",
		});
	}

	return updatedEntry;
};

export const updateWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: UpdateWatchlistInput,
) => {
	const currentUserId = ctx.session.user.id;

	const [updatedWatchlist] = await ctx.db
		.update(watchlist)
		.set({ ...input, tags: input.tags.join(",") })
		.where(and(eq(watchlist.id, input.id), eq(watchlist.userId, currentUserId)))
		.returning();

	return updatedWatchlist;
};

export const toggleLike = async (
	ctx: ProtectedTRPCContext,
	input: ToggleLikeInput,
) => {
	const currentUserId = ctx.session.user.id;
	const existingLike = await ctx.db.query.like.findFirst({
		where: (table, { and, eq }) =>
			and(
				eq(table.userId, currentUserId),
				eq(table.watchlistId, input.watchlistId),
			),
	});

	if (!existingLike) {
		await ctx.db.insert(like).values({
			userId: currentUserId,
			watchlistId: input.watchlistId,
		});
		return { liked: true };
	}

	await ctx.db
		.delete(like)
		.where(
			and(
				eq(like.userId, currentUserId),
				eq(like.watchlistId, input.watchlistId),
			),
		);

	return { liked: false };
};

export const updateTitle = async (
	ctx: ProtectedTRPCContext,
	input: UpdateWatchlistTitleInput,
) => {
	const currentUserId = ctx.session.user.id;

	const [updatedWatchlist] = await ctx.db
		.update(watchlist)
		.set({ title: input.title })
		.where(and(eq(watchlist.id, input.id), eq(watchlist.userId, currentUserId)))
		.returning();

	return updatedWatchlist;
};

export const updateDescription = async (
	ctx: ProtectedTRPCContext,
	input: UpdateWatchlistDescriptionInput,
) => {
	const currentUserId = ctx.session.user.id;

	const [updatedWatchlist] = await ctx.db
		.update(watchlist)
		.set({ description: input.description })
		.where(and(eq(watchlist.id, input.id), eq(watchlist.userId, currentUserId)))
		.returning();

	return updatedWatchlist;
};

export const updateTags = async (
	ctx: ProtectedTRPCContext,
	input: UpdateWatchlistTagsInput,
) => {
	const currentUserId = ctx.session.user.id;

	const [updatedWatchlist] = await ctx.db
		.update(watchlist)
		.set({ tags: input.tags.join(",") })
		.where(and(eq(watchlist.id, input.id), eq(watchlist.userId, currentUserId)))
		.returning();

	return updatedWatchlist;
};

export const cloneWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: CloneWatchlistInput,
) => {
	const currentUserId = ctx.session.user.id;

	const checkWatchlist = await ctx.db.query.watchlist.findFirst({
		where: (table, { eq }) => eq(table.id, input.id),
	});
	if (!checkWatchlist) {
		throw new Error("Watchlist not found");
	}

	const watchlistEntries = await ctx.db.query.entry.findMany({
		where: (table, { eq }) => eq(table.watchlistId, input.id),
	});

	const newWatchlistTransaction = await ctx.db.transaction(async (tx) => {
		const newWatchlistId = createId();
		const [newWatchlist] = await tx
			.insert(watchlist)
			.values({
				...checkWatchlist,
				id: newWatchlistId,
				userId: currentUserId,
				title: input.title,
			})
			.returning();

		if (newWatchlist) {
			if (watchlistEntries.length > 0) {
				const entriesInsert = watchlistEntries.map(({ id, ...entry }) => ({
					...entry,
					order: entry.order,
					userId: currentUserId,
					watchlistId: newWatchlistId,
				}));
				await tx.insert(entry).values(entriesInsert);
			}

			await tx.insert(member).values({
				watchlistId: newWatchlist.id,
				userId: currentUserId,
				role: "owner",
			});
		}
		return newWatchlist?.id;
	});
	if (!newWatchlistTransaction) {
		throw new Error("Failed to clone watchlist");
	}
	return newWatchlistTransaction;
};
