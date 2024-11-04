"use server";

import { z } from "zod";
import { authActionClient } from "../safe-action";
import { and, eq } from "@serea/db";
import { User, WatchlistInvitation, WatchlistMember } from "@serea/db/schema";

export const watchlistInviteSchema = z.object({
	watchlistId: z.string(),
	inviteeEmail: z.string().email(),
	role: z.enum(["viewer", "editor"]),
});
export type WatchlistInviteSchemaType = z.infer<typeof watchlistInviteSchema>;

export const inviteMemberAction = authActionClient
	.schema(watchlistInviteSchema)
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
