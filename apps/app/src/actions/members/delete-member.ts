"use server";

import { z } from "zod";
import { authActionClient } from "../safe-action";
import { WatchlistMember } from "@serea/db/schema";
import { and, eq } from "@serea/db";

export const deleteMemberSchema = z.object({
	watchlistId: z.string(),
	memberId: z.string(),
});
export type DeleteMemberSchemaType = z.infer<typeof deleteMemberSchema>;

export const deleteMemberAction = authActionClient
	.schema(deleteMemberSchema)
	.metadata({ name: "delete-member" })
	.action(async ({ parsedInput, ctx }) => {
		await ctx.db
			.delete(WatchlistMember)
			.where(
				and(
					eq(WatchlistMember.watchlistId, parsedInput.watchlistId),
					eq(WatchlistMember.userId, parsedInput.memberId),
				),
			);

		return true;
	});
