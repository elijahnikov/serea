import { auth } from "@serea/auth";
import { eq } from "@serea/db";
import { db } from "@serea/db/client";
import { WatchlistEntries } from "@serea/db/schema";
import { unstable_cache } from "next/cache";
import { z } from "zod";

export const getWatchlistEntriesSchema = z.object({
	id: z.string(),
});
export type GetWatchlistEntriesSchemaType = z.infer<
	typeof getWatchlistEntriesSchema
>;
export type GetWatchlistEntriesReturnType = Awaited<
	ReturnType<typeof getWatchlistEntries>
>;

export const getWatchlistEntries = async (
	params: GetWatchlistEntriesSchemaType,
) => {
	const session = await auth();
	if (!session?.user) {
		return null;
	}

	return unstable_cache(
		async () => {
			return getWatchlistEntriesQuery({
				...params,
			});
		},
		["recalls", session.user.email],
		{
			tags: [`watchlist_entries_${params.id}_${session.user.email}`],
		},
	)();
};

const getWatchlistEntriesQuery = async ({
	id,
}: GetWatchlistEntriesSchemaType) => {
	const entries = await db.query.WatchlistEntries.findMany({
		where: eq(WatchlistEntries.watchlistId, id),
		with: {
			movie: true,
			watched: {
				with: {
					user: true,
				},
			},
		},
	});
	return entries;
};
