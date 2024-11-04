"use server";

import { authActionClient } from "../safe-action";
import { and, eq } from "@serea/db";
import { WatchlistLike } from "@serea/db/schema";
import { revalidateTag } from "next/cache";
import { toggleWatchlistLike } from "@serea/schemas/watchlist";

export const toggleWatchlistLikeAction = authActionClient
	.schema(toggleWatchlistLike)
	.metadata({ name: "toggle-watchlist-like" })
	.action(async ({ parsedInput, ctx }) => {
		const currentUserId = ctx.session.user.id;
		const existingLike = await ctx.db.query.WatchlistLike.findFirst({
			where: and(
				eq(WatchlistLike.userId, currentUserId),
				eq(WatchlistLike.watchlistId, parsedInput.watchlistId),
			),
		});

		if (!existingLike) {
			await ctx.db.insert(WatchlistLike).values({
				userId: currentUserId,
				watchlistId: parsedInput.watchlistId,
			});
			revalidateTag(
				`watchlist_${parsedInput.watchlistId}_${ctx.session.user.email}`,
			);
			return { liked: true };
		}

		await ctx.db
			.delete(WatchlistLike)
			.where(
				and(
					eq(WatchlistLike.userId, currentUserId),
					eq(WatchlistLike.watchlistId, parsedInput.watchlistId),
				),
			);

		revalidateTag(
			`watchlist_${parsedInput.watchlistId}_${ctx.session.user.email}`,
		);
		return { liked: false };
	});
