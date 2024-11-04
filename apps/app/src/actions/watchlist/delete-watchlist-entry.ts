"use server";

import { authActionClient } from "../safe-action";
import { and, eq, gt, sql } from "@serea/db";
import { Watchlist, WatchlistEntries } from "@serea/db/schema";
import { revalidateTag } from "next/cache";
import { deleteWatchlistEntry } from "@serea/schemas/watchlist";

export const deleteWatchlistEntryAction = authActionClient
	.schema(deleteWatchlistEntry)
	.metadata({ name: "delete-watchlist-entry" })
	.action(async ({ parsedInput, ctx }) => {
		const entry = await ctx.db.query.WatchlistEntries.findFirst({
			where: eq(WatchlistEntries.id, parsedInput.entryId),
		});

		if (!entry) {
			throw new Error("Entry not found");
		}

		const deletedOrder = entry.order;

		const [deleted] = await ctx.db
			.delete(WatchlistEntries)
			.where(
				and(
					eq(WatchlistEntries.watchlistId, parsedInput.watchlistId),
					eq(WatchlistEntries.id, parsedInput.entryId),
				),
			)
			.returning();

		if (!deleted) {
			throw new Error("Could not delete entry");
		}

		const [deletedEntry] = await ctx.db
			.update(WatchlistEntries)
			.set({ order: sql`${WatchlistEntries.order} - 1` })
			.where(
				and(
					eq(WatchlistEntries.watchlistId, parsedInput.watchlistId),
					gt(WatchlistEntries.order, deletedOrder),
				),
			)
			.returning();

		if (deletedEntry) {
			await ctx.db
				.update(Watchlist)
				.set({
					updatedAt: new Date(),
					entriesLength: sql`${Watchlist.entriesLength} - 1`,
				})
				.where(eq(Watchlist.id, parsedInput.watchlistId));
		}

		revalidateTag(
			`watchlist_entries_${parsedInput.watchlistId}_${ctx.session.user.email}`,
		);
		return true;
	});
