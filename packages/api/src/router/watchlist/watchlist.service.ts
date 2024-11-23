import { entry, like, member, watchlist } from "@serea/db/schema";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	AddWatchlistEntryInput,
	CreateWatchlistInput,
	GetWatchlistEntriesInput,
	GetWatchlistInput,
	GetWatchlistLikesInput,
} from "./watchlist.input";
import { TRPCError } from "@trpc/server";
import { createId } from "@paralleldrive/cuid2";
import { eq, sql } from "@serea/db";

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

	// Combine watchlist existence check and existing entry check into a single query
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
		throw new Error("Watchlist not found");
	}

	if (watchlistAndEntry.entry) {
		return watchlistAndEntry.entry;
	}

	const newOrder = (watchlistAndEntry.maxOrder ?? 0) + 1;

	// Combine insert and update into a single transaction
	const [newEntry] = await ctx.db.transaction(async (tx) => {
		const [createdEntry] = await tx
			.insert(entry)
			.values({
				id: input.id,
				watchlistId: input.watchlistId,
				contentId: input.contentId,
				userId: currentUserId,
				order: newOrder,
			})
			.returning();

		await tx
			.update(watchlist)
			.set({
				updatedAt: new Date(),
				numberOfEntries: sql`${watchlist.numberOfEntries} + 1`,
			})
			.where(eq(watchlist.id, input.watchlistId));

		return [createdEntry];
	});

	return newEntry;
};
