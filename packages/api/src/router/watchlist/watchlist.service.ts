import type { WatchlistCreateSchemaType } from "@serea/validators";
import type { ProtectedTRPCContext } from "../../trpc";
import { Watchlist, WatchlistEntries } from "@serea/db/schema";
import { TRPCError } from "@trpc/server";
import { createId } from "@paralleldrive/cuid2";

export const createWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: WatchlistCreateSchemaType,
) => {
	const currentUserId = ctx.session.user.id;
	const id = createId();
	const [watchlist] = await ctx.db
		.insert(Watchlist)
		.values({ id, ...input, userId: currentUserId })
		.returning();

	if (!watchlist) {
		throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
	}

	if (input.entries.length > 0) {
		const entriesInsert = input.entries.map((entry) => ({
			contentId: entry.contentId,
			userId: currentUserId,
			watchlistId: watchlist.id,
		}));
		await ctx.db.insert(WatchlistEntries).values(entriesInsert);
	}

	return watchlist.id;
};
