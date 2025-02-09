import type { ProtectedTRPCContext } from "../../trpc";
import type { CreateWatchlistInput } from "./watchlist.input";

export const createWatchlist = async (
	ctx: ProtectedTRPCContext,
	input: CreateWatchlistInput,
) => {
	const currentUserId = ctx.session.user.id;
};
