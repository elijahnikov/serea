"use server";

import { z } from "zod";
import { authActionClient } from "../safe-action";
import { and, eq } from "@serea/db";
import { Watchlist, Watched, WatchlistMember } from "@serea/db/schema";

const toggleAllWatchedSchema = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type ToggleAllWatchedSchemaType = z.infer<typeof toggleAllWatchedSchema>;

export const toggleAllWatchedAction = authActionClient
	.schema(toggleAllWatchedSchema)
	.metadata({ name: "toggle-all-watched" })
	.action(async ({ parsedInput, ctx }) => {
		const currentUserId = ctx.session.user.id;

		const watchlist = await ctx.db.query.Watchlist.findFirst({
			where: and(
				eq(Watchlist.id, parsedInput.watchlistId),
				eq(Watchlist.userId, currentUserId),
			),
		});
		if (!watchlist) {
			throw new Error("Watchlist not found");
		}

		await ctx.db
			.delete(Watched)
			.where(
				and(
					eq(Watched.watchlistId, parsedInput.watchlistId),
					eq(Watched.entryId, parsedInput.entryId),
				),
			);

		const members = await ctx.db.query.WatchlistMember.findMany({
			where: eq(WatchlistMember.watchlistId, parsedInput.watchlistId),
		});

		const userIds = members.map((member) => {
			return {
				userId: member.userId,
				memberId: member.id,
			};
		});

		await ctx.db.insert(Watched).values(
			userIds.map((userId) => ({
				watchlistId: parsedInput.watchlistId,
				entryId: parsedInput.entryId,
				...userId,
			})),
		);

		return true;
	});
