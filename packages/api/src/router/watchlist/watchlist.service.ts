import type { WatchlistCreateSchemaType } from "@serea/validators";
import type { ProtectedTRPCContext } from "../../trpc";
import { Watchlist, WatchlistEntries, WatchlistMember } from "@serea/db/schema";
import { TRPCError } from "@trpc/server";
import { createId } from "@paralleldrive/cuid2";
import type {
	AddWatchlistEntrySchemaType,
	DeleteWatchlistEntrySchemaType,
	GetWatchlistEntriesSchemaType,
	GetWatchlistSchemaType,
	UpdateEntryOrderSchemaType,
} from "./watchlist.input";
import { and, eq, gt, lt, sql } from "@serea/db";

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
			entries: {
				with: {
					movie: true,
				},
			},
			user: true,
		},
	});

	const isOwner = !!(watchlist && watchlist.user.id === currentUserId);

	return watchlist;
};

export const getWatchlistEntries = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistEntriesSchemaType,
) => {
	const entries = await ctx.db.query.WatchlistEntries.findMany({
		where: eq(WatchlistEntries.watchlistId, input.id),
		with: {
			movie: true,
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
	const currentOrder = await ctx.db.query.WatchlistEntries.findMany({
		where: eq(WatchlistEntries.watchlistId, input.watchlistId),
	});

	const [newEntry] = await ctx.db
		.insert(WatchlistEntries)
		.values({
			watchlistId: input.watchlistId,
			contentId: input.contentId,
			userId: currentUserId,
			order: currentOrder.length + 1,
		})
		.returning();

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
