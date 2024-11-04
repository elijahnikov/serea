"use server";

import { and, eq } from "@serea/db";
import { WatchlistInvitation } from "@serea/db/schema";
import { authActionClient } from "../safe-action";
import { deleteInvite } from "@serea/schemas/members";

export const deleteInviteAction = authActionClient
	.schema(deleteInvite)
	.metadata({ name: "delete-invite" })
	.action(async ({ parsedInput, ctx }) => {
		const currentUserId = ctx.session.user.id;
		await ctx.db
			.delete(WatchlistInvitation)
			.where(
				and(
					eq(WatchlistInvitation.id, parsedInput.invitationId),
					eq(WatchlistInvitation.inviterId, currentUserId),
				),
			);
		return true;
	});
