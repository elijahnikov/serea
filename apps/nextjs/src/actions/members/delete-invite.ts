import { and, eq } from "@serea/db";
import { WatchlistInvitation } from "@serea/db/schema";
import { z } from "zod";
import { authActionClient } from "../safe-action";

export const deleteInviteSchema = z.object({
	invitationId: z.string(),
});
export type DeleteInviteSchemaType = z.infer<typeof deleteInviteSchema>;

export const deleteInviteAction = authActionClient
	.schema(deleteInviteSchema)
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
