"use server";

import type { WatchlistCreateSchemaType } from "@serea/validators";
import type { ProtectedTRPCContext } from "../../trpc";
import {
	Watchlist,
	WatchlistEntries,
	WatchlistLike,
	WatchlistMember,
} from "@serea/db/schema";
import { TRPCError } from "@trpc/server";
import { createId } from "@paralleldrive/cuid2";
import type {
	AddWatchlistEntrySchemaType,
	CloneWatchlistSchemaType,
	DeleteWatchlistEntrySchemaType,
	GetWatchlistEntriesSchemaType,
	GetWatchlistSchemaType,
	ToggleWatchlistLikeSchemaType,
	UpdateEntryOrderSchemaType,
} from "./watchlist.input";
import { and, eq, gt, lt, sql } from "@serea/db";
import { nanoid } from "nanoid";

export const createWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: WatchlistCreateSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	const id = createId();
	const [watchlist] = await ctx.db
		.insert(Watchlist)
		.values({ id, ...input, userId: currentUserId })
		.returning();

	if (!watchlist) {
		throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
	}

	await ctx.db.insert(WatchlistMember).values({
		watchlistId: watchlist.id,
		userId: currentUserId,
		role: "owner",
	});

	if (input.entries.length > 0) {
		const entriesInsert = input.entries.map((entry) => ({
			id: nanoid(),
			contentId: entry.contentId,
			userId: currentUserId,
			order: entry.order,
			watchlistId: watchlist.id,
		}));
		await ctx.db.insert(WatchlistEntries).values(entriesInsert);
	}

	return watchlist.id;
};

export const getWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	const watchlist = await ctx.db.query.Watchlist.findFirst({
		where: (table, { eq }) => eq(table.id, input.id),
		with: {
			likes: !currentUserId
				? undefined
				: { where: eq(WatchlistLike.userId, currentUserId) },
			entries: {
				with: {
					movie: true,
				},
			},
			user: true,
		},
	});

	if (!watchlist) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Watchlist not found" });
	}

	const likeCount =
		(await ctx.db
			.select({ count: sql`count(*)` })
			.from(WatchlistLike)
			.where(eq(WatchlistLike.watchlistId, watchlist.id))
			.then((result) => Number(result[0]?.count))) ?? 0;
	return {
		...watchlist,
		likeCount,
		isLiked: Boolean(watchlist.likes.length > 0 && ctx.session.user.id),
	};
};

export const getWatchlistEntries = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistEntriesSchemaType,
) => {
	const entries = await ctx.db.query.WatchlistEntries.findMany({
		where: eq(WatchlistEntries.watchlistId, input.id),
		with: {
			movie: true,
			watched: {
				with: {
					entry: true,
					user: true,
				},
			},
		},
	});

	return entries;
};

export const deleteWatchlistEntry = async (
	ctx: ProtectedTRPCContext,
	input: DeleteWatchlistEntrySchemaType,
) => {
	const entry = await ctx.db.query.WatchlistEntries.findFirst({
		where: eq(WatchlistEntries.id, input.entryId),
	});

	if (!entry) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Entry not found" });
	}

	const deletedOrder = entry.order;

	const [deleted] = await ctx.db
		.delete(WatchlistEntries)
		.where(
			and(
				eq(WatchlistEntries.watchlistId, input.watchlistId),
				eq(WatchlistEntries.id, input.entryId),
			),
		)
		.returning();

	if (!deleted) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Could not delete entry",
		});
	}

	await ctx.db
		.update(WatchlistEntries)
		.set({ order: sql`${WatchlistEntries.order} - 1` })
		.where(
			and(
				eq(WatchlistEntries.watchlistId, input.watchlistId),
				gt(WatchlistEntries.order, deletedOrder),
			),
		);

	return true;
};

export const addWatchlistEntry = async (
	ctx: ProtectedTRPCContext,
	input: AddWatchlistEntrySchemaType,
) => {
	const currentUserId = ctx.session.user.id;

	const watchlist = await ctx.db.query.Watchlist.findFirst({
		where: eq(Watchlist.id, input.watchlistId),
	});

	if (!watchlist) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Watchlist not found" });
	}

	const existingEntry = await ctx.db.query.WatchlistEntries.findFirst({
		where: and(
			eq(WatchlistEntries.watchlistId, watchlist.id),
			eq(WatchlistEntries.contentId, input.contentId),
		),
	});

	if (existingEntry) {
		return existingEntry;
	}

	const maxOrderResult =
		(await ctx.db
			.select({ maxOrder: sql`MAX(${WatchlistEntries.order})` })
			.from(WatchlistEntries)
			.where(eq(WatchlistEntries.watchlistId, input.watchlistId))
			.then((result) => Number(result[0]?.maxOrder))) ?? 0;

	const newOrder = maxOrderResult + 1;

	const [newEntry] = await ctx.db
		.insert(WatchlistEntries)
		.values({
			id: input.id,
			watchlistId: input.watchlistId,
			contentId: input.contentId,
			userId: currentUserId,
			order: newOrder,
		})
		.returning();

	if (newEntry) {
		await ctx.db
			.update(Watchlist)
			.set({ updatedAt: new Date() })
			.where(eq(Watchlist.id, input.watchlistId));
	}

	return newEntry;
};

export const updateEntryOrder = async (
	ctx: ProtectedTRPCContext,
	input: UpdateEntryOrderSchemaType,
) => {
	const { watchlistId, entryId, newOrder } = input;

	const currentEntry = await ctx.db.query.WatchlistEntries.findFirst({
		where: and(
			eq(WatchlistEntries.id, entryId),
			eq(WatchlistEntries.watchlistId, watchlistId),
		),
	});

	if (!currentEntry) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Entry not found" });
	}

	const oldOrder = currentEntry.order;

	if (newOrder > oldOrder) {
		await ctx.db
			.update(WatchlistEntries)
			.set({ order: sql`${WatchlistEntries.order} - 1` })
			.where(
				and(
					eq(WatchlistEntries.watchlistId, watchlistId),
					gt(WatchlistEntries.order, oldOrder),
					lt(WatchlistEntries.order, newOrder + 1),
				),
			);
	} else if (newOrder < oldOrder) {
		await ctx.db
			.update(WatchlistEntries)
			.set({ order: sql`${WatchlistEntries.order} + 1` })
			.where(
				and(
					eq(WatchlistEntries.watchlistId, watchlistId),
					lt(WatchlistEntries.order, oldOrder),
					gt(WatchlistEntries.order, newOrder - 1),
				),
			);
	}

	const [updatedEntry] = await ctx.db
		.update(WatchlistEntries)
		.set({ order: newOrder })
		.where(
			and(
				eq(WatchlistEntries.id, entryId),
				eq(WatchlistEntries.watchlistId, watchlistId),
			),
		)
		.returning();

	if (!updatedEntry) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to update entry order",
		});
	}

	return updatedEntry;
};

export const toggleWatchlistLike = async (
	ctx: ProtectedTRPCContext,
	{ watchlistId }: ToggleWatchlistLikeSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	const existingLike = await ctx.db.query.WatchlistLike.findFirst({
		where: and(
			eq(WatchlistLike.userId, currentUserId),
			eq(WatchlistLike.watchlistId, watchlistId),
		),
	});

	if (!existingLike) {
		await ctx.db.insert(WatchlistLike).values({
			userId: currentUserId,
			watchlistId: watchlistId,
		});
		return { liked: true };
	}

	await ctx.db
		.delete(WatchlistLike)
		.where(
			and(
				eq(WatchlistLike.userId, currentUserId),
				eq(WatchlistLike.watchlistId, watchlistId),
			),
		);
	return { liked: false };
};

export const cloneWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: CloneWatchlistSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	const watchlist = await ctx.db.query.Watchlist.findFirst({
		where: eq(Watchlist.id, input.id),
	});
	if (!watchlist) {
		throw new TRPCError({ code: "NOT_FOUND", message: "Watchlist not found" });
	}

	const watchlistEntries = await ctx.db.query.WatchlistEntries.findMany({
		where: eq(WatchlistEntries.watchlistId, watchlist.id),
	});

	const newWatchlistTransaction = await ctx.db.transaction(async (tx) => {
		const newWatchlistId = createId();
		const [newWatchlist] = await tx
			.insert(Watchlist)
			.values({
				...watchlist,
				id: newWatchlistId,
				userId: currentUserId,
				title: `${watchlist.title} (Copy)`,
			})
			.returning();

		if (newWatchlist) {
			if (watchlistEntries.length > 0) {
				const entriesInsert = watchlistEntries.map((entry, index) => ({
					...entry,
					id: nanoid(),
					order: entry.order,
					userId: currentUserId,
					watchlistId: newWatchlist.id,
				}));
				await tx.insert(WatchlistEntries).values(entriesInsert);
			}

			await tx.insert(WatchlistMember).values({
				watchlistId: newWatchlist.id,
				userId: currentUserId,
				role: "owner",
			});
		}
		return newWatchlist?.id;
	});
	if (!newWatchlistTransaction) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to clone watchlist",
		});
	}
	return newWatchlistTransaction;
};
