import { auth } from "@serea/auth";
import { and, eq } from "@serea/db";
import { db } from "@serea/db/client";
import { WatchlistMember, Watched } from "@serea/db/schema";
import type { GetWatchStatus } from "@serea/schemas/watched";
import { unstable_cache } from "next/cache";

export const getWatchStatus = async (params: GetWatchStatus) => {
	const session = await auth();
	if (!session?.user) {
		return null;
	}

	return unstable_cache(
		async () => {
			return getWatchStatusQuery({ ...params, userId: session.user.id });
		},
		["watch-status", session.user.email],
		{
			tags: [`watch-status_${params.watchlistId}_${session.user.email}`],
		},
	);
};

const getWatchStatusQuery = async (
	input: GetWatchStatus & { userId: string },
) => {
	const isMember = await db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.watchlistId, input.watchlistId),
			eq(WatchlistMember.userId, input.userId),
		),
	});
	if (!isMember) {
		throw new Error("Not a member.");
	}
	const watched = await db.query.Watched.findMany({
		where: and(
			eq(Watched.watchlistId, input.watchlistId),
			eq(Watched.entryId, input.entryId),
		),
		with: {
			user: {
				columns: {
					name: true,
					image: true,
					email: true,
				},
			},
		},
	});
	return watched;
};
