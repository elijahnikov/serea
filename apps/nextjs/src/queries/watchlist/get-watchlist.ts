import { auth } from "@serea/auth";
import { unstable_cache } from "next/cache";
import { db } from "@serea/db/client";
import { eq, sql } from "@serea/db";
import { WatchlistLike } from "@serea/db/schema";
import { z } from "zod";

export const getWatchlistSchema = z.object({
	id: z.string(),
});
export type GetWatchlistSchemaType = z.infer<typeof getWatchlistSchema>;

export type GetWatchlistReturnType = Awaited<ReturnType<typeof getWatchlist>>;

export const getWatchlist = async (params: GetWatchlistSchemaType) => {
	const session = await auth();
	if (!session?.user) {
		return null;
	}

	return unstable_cache(
		async () => {
			return getWatchlistQuery({
				...params,
				userId: session.user.id,
			});
		},
		["recalls", session.user.email],
		{
			tags: [`watchlist_${params.id}_${session.user.email}`],
		},
	)();
};

const getWatchlistQuery = async ({
	id,
	userId,
}: GetWatchlistSchemaType & { userId: string }) => {
	const watchlist = await db.query.Watchlist.findFirst({
		where: (table, { eq }) => eq(table.id, id),
		with: {
			likes: !userId ? undefined : { where: eq(WatchlistLike.userId, userId) },
			entries: {
				with: {
					movie: true,
				},
			},
			user: true,
		},
	});

	if (!watchlist) {
		return null;
	}

	const likeCount =
		(await db
			.select({ count: sql`count(*)` })
			.from(WatchlistLike)
			.where(eq(WatchlistLike.watchlistId, watchlist.id))
			.then((result) => Number(result[0]?.count))) ?? 0;
	return {
		...watchlist,
		likeCount,
		isLiked: Boolean(watchlist.likes.length > 0 && userId),
	};
};
