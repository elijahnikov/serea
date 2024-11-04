"use server";

import { watchlistCreateSchema } from "../../../../../packages/schemas/src";
import { createId } from "@paralleldrive/cuid2";
import { Watchlist, WatchlistEntries, WatchlistMember } from "@serea/db/schema";
import { nanoid } from "nanoid";
import { authActionClient } from "../safe-action";

// const watchlistCreateSchema = z.object({
// 	title: z.string().min(2, {
// 		message: "Title must be at least 2 characters.",
// 	}),
// 	description: z.string().optional(),
// 	tags: z.string().array(),
// 	entries: movieTableSchema.array(),
// 	private: z.boolean().optional(),
// 	hideStats: z.boolean().optional(),
// });

export const createWatchlistAction = authActionClient
	.schema(watchlistCreateSchema)
	.metadata({ name: "create-watchlist" })
	.action(async ({ parsedInput, ctx }) => {
		const currentUserId = ctx.session.user.id;
		const id = createId();
		const [watchlist] = await ctx.db
			.insert(Watchlist)
			.values({
				id,
				...parsedInput,
				userId: currentUserId,
				tags: parsedInput.tags.join(","),
				entriesLength: parsedInput.entries.length,
			})
			.returning();

		if (!watchlist) {
			throw new Error("Failed to create watchlist");
		}

		await ctx.db.insert(WatchlistMember).values({
			watchlistId: watchlist.id,
			userId: currentUserId,
			role: "owner",
		});

		if (parsedInput.entries.length > 0) {
			const entriesInsert = parsedInput.entries.map((entry) => ({
				id: nanoid(),
				contentId: entry.contentId,
				userId: currentUserId,
				order: entry.order,
				watchlistId: watchlist.id,
			}));
			await ctx.db.insert(WatchlistEntries).values(entriesInsert);
		}

		return watchlist.id;
	});
