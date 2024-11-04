"use server";

import { authActionClient } from "../safe-action";
import { eq } from "@serea/db";
import { Watchlist, WatchlistEntries, WatchlistMember } from "@serea/db/schema";
import { nanoid } from "nanoid";
import { createId } from "@paralleldrive/cuid2";
import { cloneWatchlist } from "@serea/schemas/watchlist";

export const cloneWatchlistAction = authActionClient
	.schema(cloneWatchlist)
	.metadata({ name: "clone-watchlist" })
	.action(async ({ parsedInput, ctx }) => {
		const currentUserId = ctx.session.user.id;
		const watchlist = await ctx.db.query.Watchlist.findFirst({
			where: eq(Watchlist.id, parsedInput.id),
		});
		if (!watchlist) {
			throw new Error("Watchlist not found");
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
			throw new Error("Failed to clone watchlist");
		}
		return newWatchlistTransaction;
	});
