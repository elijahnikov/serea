import { z } from "zod";
import { authActionClient } from "../safe-action";
import { and, eq } from "@serea/db";
import { WatchlistLike } from "@serea/db/schema";

export const toggleWatchlistLikeSchema = z.object({
	watchlistId: z.string(),
});
export type ToggleWatchlistLikeSchemaType = z.infer<
	typeof toggleWatchlistLikeSchema
>;

export const toggleWatchlistLikeAction = authActionClient
	.schema(toggleWatchlistLikeSchema)
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
		return { liked: false };
	});
