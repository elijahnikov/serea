"use server";

import { authActionClient } from "../safe-action";
import { and, eq } from "@serea/db";
import { WatchlistInvitation, WatchlistMember } from "@serea/db/schema";
import { respondToInvite } from "@serea/schemas/members";

export const respondToInviteAction = authActionClient
	.schema(respondToInvite)
	.metadata({ name: "respond-to-invite" })
	.action(async ({ parsedInput, ctx }) => {
		const currentUserId = ctx.session.user.id;
		const invitation = await ctx.db.query.WatchlistInvitation.findFirst({
			where: and(
				eq(WatchlistInvitation.id, parsedInput.invitationId),
				eq(WatchlistInvitation.inviteeId, currentUserId),
			),
		});

		if (!invitation) {
			throw new Error("Invitation not found");
		}

		if (parsedInput.response === "accept") {
			await ctx.db.insert(WatchlistMember).values({
				userId: currentUserId,
				watchlistId: invitation.watchlistId,
				role: invitation.role,
			});
		}

		await ctx.db
			.delete(WatchlistInvitation)
			.where(
				and(
					eq(WatchlistInvitation.id, invitation.id),
					eq(WatchlistInvitation.inviteeId, currentUserId),
				),
			);

		return true;
	});
