import { auth } from "@serea/auth";
import { and, eq } from "@serea/db";
import { db } from "@serea/db/client";
import { WatchlistMember, Watched } from "@serea/db/schema";

import { unstable_cache } from "next/cache";
import { z } from "zod";

export const getWatchStatusSchema = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type GetWatchStatusSchemaType = z.infer<typeof getWatchStatusSchema>;

export const getWatchStatus = async (params: GetWatchStatusSchemaType) => {
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
	input: GetWatchStatusSchemaType & { userId: string },
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
