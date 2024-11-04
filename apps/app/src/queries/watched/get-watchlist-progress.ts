import { auth } from "@serea/auth";
import { eq } from "@serea/db";
import { db } from "@serea/db/client";
import { Watchlist, WatchlistMember } from "@serea/db/schema";
import type { GetWatchlistProgress } from "@serea/schemas/watched";
import { unstable_cache } from "next/cache";

export const getWatchlistProgress = async (params: GetWatchlistProgress) => {
	const session = await auth();
	if (!session?.user) {
		return null;
	}

	return unstable_cache(
		async () => {
			return getWatchlistProgressQuery(params);
		},
		["watchlist-progress", session.user.email],
		{
			tags: [`watchlist-progress_${params.watchlistId}_${session.user.email}`],
		},
	)();
};

const getWatchlistProgressQuery = async (input: GetWatchlistProgress) => {
	const watchlist = await db.query.Watchlist.findFirst({
		where: eq(Watchlist.id, input.watchlistId),
		columns: {
			entriesLength: true,
		},
	});
	if (!watchlist) {
		throw new Error("Watchlist not found");
	}

	const members = await db.query.WatchlistMember.findMany({
		where: eq(WatchlistMember.watchlistId, input.watchlistId),
		with: {
			watched: {
				columns: {
					id: true,
				},
			},
			user: {
				columns: {
					id: true,
					name: true,
					image: true,
				},
			},
		},
	});
	return { members, entriesLength: watchlist.entriesLength ?? 0 };
};
