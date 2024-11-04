"use server";

import { z } from "zod";
import { authActionClient } from "../safe-action";
import { and, eq } from "@serea/db";
import { Watchlist, Watched } from "@serea/db/schema";
import { revalidateTag } from "next/cache";

const toggleWatchedSchema = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type ToggleWatchedSchemaType = z.infer<typeof toggleWatchedSchema>;

export const toggleWatchedAction = authActionClient
	.schema(toggleWatchedSchema)
	.metadata({ name: "toggle-watched" })
	.action(async ({ parsedInput, ctx }) => {
		const currentUserId = ctx.session.user.id;

		const watchlist = await ctx.db.query.Watchlist.findFirst({
			where: and(eq(Watchlist.id, parsedInput.watchlistId)),
			with: {
				members: true,
			},
		});
		if (!watchlist) {
			throw new Error("Watchlist not found");
		}
		const isMember = watchlist.members.some(
			(member) => member.userId === currentUserId,
		);
		if (!isMember) {
			throw new Error("You are not a member of this watchlist");
		}

		const watched = await ctx.db.query.Watched.findFirst({
			where: and(
				eq(Watched.watchlistId, parsedInput.watchlistId),
				eq(Watched.entryId, parsedInput.entryId),
				eq(Watched.userId, currentUserId),
			),
		});

		const memberId = watchlist.members.find(
			(member) => member.userId === currentUserId,
		)?.id;
		if (!watched) {
			if (memberId) {
				await ctx.db.insert(Watched).values({
					watchlistId: parsedInput.watchlistId,
					entryId: parsedInput.entryId,
					userId: currentUserId,
					memberId,
				});
				revalidateTag(
					`watchlist_entries_${parsedInput.watchlistId}_${ctx.session.user.email}`,
				);
				revalidateTag(
					`watchlist-progress_${parsedInput.watchlistId}_${ctx.session.user.email}`,
				);
				return { watched: true };
			}
		} else {
			await ctx.db.delete(Watched).where(eq(Watched.id, watched.id));
			revalidateTag(
				`watchlist_entries_${parsedInput.watchlistId}_${ctx.session.user.email}`,
			);
			revalidateTag(
				`watchlist-progress_${parsedInput.watchlistId}_${ctx.session.user.email}`,
			);
			return { watched: false };
		}
	});
