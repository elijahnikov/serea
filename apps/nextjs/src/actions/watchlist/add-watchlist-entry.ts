import { movieTableSchema } from "@serea/validators";
import { z } from "zod";
import { authActionClient } from "../safe-action";
import { Watchlist, WatchlistEntries } from "@serea/db/schema";
import { and, eq, sql } from "@serea/db";

export const addWatchlistEntrySchema = z.object({
	id: z.string(),
	watchlistId: z.string(),
	contentId: z.number(),
	content: movieTableSchema.omit({ order: true }),
});
export type AddWatchlistEntrySchemaType = z.infer<
	typeof addWatchlistEntrySchema
>;

export const addWatchlistEntryAction = authActionClient
	.schema(addWatchlistEntrySchema)
	.metadata({ name: "add-watchlist-entry" })
	.action(async ({ parsedInput, ctx }) => {
		const currentUserId = ctx.session.user.id;

		const watchlist = await ctx.db.query.Watchlist.findFirst({
			where: eq(Watchlist.id, parsedInput.watchlistId),
		});

		if (!watchlist) {
			throw new Error("Watchlist not found");
		}

		const existingEntry = await ctx.db.query.WatchlistEntries.findFirst({
			where: and(
				eq(WatchlistEntries.watchlistId, watchlist.id),
				eq(WatchlistEntries.contentId, parsedInput.contentId),
			),
		});

		if (existingEntry) {
			return existingEntry;
		}

		const maxOrderResult =
			(await ctx.db
				.select({ maxOrder: sql`MAX(${WatchlistEntries.order})` })
				.from(WatchlistEntries)
				.where(eq(WatchlistEntries.watchlistId, parsedInput.watchlistId))
				.then((result) => Number(result[0]?.maxOrder))) ?? 0;

		const newOrder = maxOrderResult + 1;

		const [newEntry] = await ctx.db
			.insert(WatchlistEntries)
			.values({
				id: parsedInput.id,
				watchlistId: parsedInput.watchlistId,
				contentId: parsedInput.contentId,
				userId: currentUserId,
				order: newOrder,
			})
			.returning();

		if (newEntry) {
			await ctx.db
				.update(Watchlist)
				.set({
					updatedAt: new Date(),
					entriesLength: sql`${Watchlist.entriesLength} + 1`,
				})
				.where(eq(Watchlist.id, parsedInput.watchlistId));
		}

		return newEntry;
	});
