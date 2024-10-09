import type { WatchlistCreateSchemaType } from "@serea/validators";
import type { ProtectedTRPCContext } from "../../trpc";
import { Watchlist, WatchlistEntries } from "@serea/db/schema";
import { TRPCError } from "@trpc/server";
import { createId } from "@paralleldrive/cuid2";
import type { GetWatchlistSchemaType } from "./watchlist.input";
import { redirect } from "next/navigation";

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
			order: entry.order,
			watchlistId: watchlist.id,
		}));
		await ctx.db.insert(WatchlistEntries).values(entriesInsert);
	}

	return watchlist.id;
};

export const getWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: GetWatchlistSchemaType,
) => {
	const watchlist = await ctx.db.query.Watchlist.findFirst({
		where: (table, { eq }) => eq(table.id, input.id),
		with: {
			entries: {
				with: {
					movie: true,
				},
			},
			user: true,
		},
	});

	return watchlist;
};
