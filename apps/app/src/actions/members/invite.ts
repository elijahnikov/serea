"use server";

import { authActionClient } from "../safe-action";
import { and, eq } from "@serea/db";
import { User, WatchlistInvitation, WatchlistMember } from "@serea/db/schema";
import { watchlistInvite } from "@serea/schemas/members";

export const inviteMemberAction = authActionClient
	.schema(watchlistInvite)
	.metadata({ name: "invite-to-watchlist" })
	.action(async ({ parsedInput, ctx }) => {
		const currentUserId = ctx.session.user.id;

		const userToInvite = await ctx.db.query.User.findFirst({
			where: eq(User.email, parsedInput.inviteeEmail),
		});

		if (!userToInvite) {
			throw new Error("User not found");
		}

		const isUserAlreadyMember = await ctx.db.query.WatchlistMember.findFirst({
			where: and(
				eq(WatchlistMember.userId, userToInvite.id),
				eq(WatchlistMember.watchlistId, parsedInput.watchlistId),
			),
		});

		if (isUserAlreadyMember) {
			throw new Error("User is already a member of the watchlist");
		}

		const [invite] = await ctx.db
			.insert(WatchlistInvitation)
			.values({
				inviteeEmail: userToInvite?.email,
				inviteeId: userToInvite?.id,
				watchlistId: parsedInput.watchlistId,
				inviterId: currentUserId,
				role: parsedInput.role,
			})
			.returning();

		return invite;
	});
