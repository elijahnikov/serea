"use server";

import { authActionClient } from "../safe-action";
import { and, eq } from "@serea/db";
import { Watchlist, WatchlistMember } from "@serea/db/schema";
import { updateRole } from "@serea/schemas/members";

export const updateRoleAction = authActionClient
	.schema(updateRole)
	.metadata({ name: "update-role" })
	.action(async ({ parsedInput, ctx }) => {
		const currentUserId = ctx.session.user.id;
		const watchlist = await ctx.db.query.Watchlist.findFirst({
			where: eq(Watchlist.id, parsedInput.watchlistId),
		});

		if (!watchlist) {
			throw new Error("Watchlist not found");
		}

		const owner = await ctx.db.query.WatchlistMember.findFirst({
			where: and(
				eq(WatchlistMember.watchlistId, watchlist.id),
				eq(WatchlistMember.role, "owner"),
			),
		});
		if (!owner || owner.userId !== currentUserId) {
			throw new Error("You are not the owner of this watchlist");
		}

		const member = await ctx.db.query.WatchlistMember.findFirst({
			where: and(
				eq(WatchlistMember.watchlistId, watchlist.id),
				eq(WatchlistMember.userId, parsedInput.memberId),
			),
		});

		if (!member) {
			throw new Error("Member not found");
		}

		await ctx.db
			.update(WatchlistMember)
			.set({ role: parsedInput.role })
			.where(
				and(
					eq(WatchlistMember.watchlistId, watchlist.id),
					eq(WatchlistMember.userId, parsedInput.memberId),
				),
			);

		return true;
	});
