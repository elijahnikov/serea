"use server";

import { z } from "zod";
import { authActionClient } from "../safe-action";
import { WatchlistMember } from "@serea/db/schema";
import { and, eq } from "@serea/db";
import { deleteMember } from "@serea/schemas/members";

export const deleteMemberAction = authActionClient
	.schema(deleteMember)
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
