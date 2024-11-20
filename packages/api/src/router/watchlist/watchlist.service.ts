import { entry, member, watchlist } from "@serea/db/schema";
import type { ProtectedTRPCContext } from "../../trpc";
import type { CreateWatchlistInput } from "./watchlist.input";
import { TRPCError } from "@trpc/server";

export const createWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: CreateWatchlistInput,
) => {
	const currentUserId = ctx.session.user.id;

	const [newWatchlist] = await ctx.db
		.insert(watchlist)
		.values({
			...input,
			userId: currentUserId,
			tags: input.tags.join(","),
			numberOfEntries: input.entries.length ?? 0,
		})
		.returning();

	if (!newWatchlist) {
		throw new TRPCError({
			code: "INTERNAL_SERVER_ERROR",
			message: "Failed to create watchlist",
		});
	}

	await ctx.db.insert(member).values({
		watchlistId: newWatchlist.id,
		userId: currentUserId,
		role: "owner",
	});

	if (input.entries.length > 0) {
		await ctx.db.insert(entry).values(
			input.entries.map((entry) => ({
				...entry,
				watchlistId: newWatchlist.id,
				userId: currentUserId,
			})),
		);
	}

	return newWatchlist.id;
};
