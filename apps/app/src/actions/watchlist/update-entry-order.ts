"use server";

import { z } from "zod";
import { authActionClient } from "../safe-action";
import { and, eq, gt, lt, sql } from "@serea/db";
import { WatchlistEntries } from "@serea/db/schema";
import { revalidateTag } from "next/cache";

const updateEntryOrderSchema = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
	newOrder: z.number(),
});
export type UpdateEntryOrderSchemaType = z.infer<typeof updateEntryOrderSchema>;

export const updateEntryOrderAction = authActionClient
	.schema(updateEntryOrderSchema)
	.metadata({ name: "update-entry-order" })
	.action(async ({ parsedInput, ctx }) => {
		const { watchlistId, entryId, newOrder } = parsedInput;
		const currentEntry = await ctx.db.query.WatchlistEntries.findFirst({
			where: and(
				eq(WatchlistEntries.id, entryId),
				eq(WatchlistEntries.watchlistId, watchlistId),
			),
		});

		if (!currentEntry) {
			throw new Error("Entry not found");
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
			throw new Error("Failed to update entry order");
		}
		revalidateTag(`watchlist_entries_${watchlistId}_${ctx.session.user.email}`);

		return updatedEntry;
	});
