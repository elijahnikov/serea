import { auth } from "@serea/auth";
import { and, desc, eq } from "@serea/db";
import { db } from "@serea/db/client";
import { WatchlistInvitation, WatchlistMember } from "@serea/db/schema";
import { unstable_cache } from "next/cache";
import { z } from "zod";

const listInvitesSchema = z.object({
	watchlistId: z.string(),
});
export type ListInvitesSchemaType = z.infer<typeof listInvitesSchema>;
export type ListInvitesReturnType = Awaited<ReturnType<typeof listInvites>>;

export const listInvites = async (params: ListInvitesSchemaType) => {
	const session = await auth();
	if (!session?.user) {
		return null;
	}

	return unstable_cache(
		async () => {
			return listInvitesQuery({ ...params, userId: session.user.id });
		},
		["list-invites", session.user.email],
		{
			tags: [`list-invites_${params.watchlistId}_${session.user.email}`],
		},
	)();
};

const listInvitesQuery = async (
	params: ListInvitesSchemaType & { userId: string },
) => {
	const isOwnerOfWatchlist = await db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.userId, params.userId),
			eq(WatchlistMember.watchlistId, params.watchlistId),
			eq(WatchlistMember.role, "owner"),
		),
	});
	if (!isOwnerOfWatchlist) {
		throw new Error("Not a member.");
	}

	const invites = await db.query.WatchlistInvitation.findMany({
		where: eq(WatchlistInvitation.watchlistId, params.watchlistId),
		orderBy: desc(WatchlistInvitation.createdAt),
		with: {
			invitee: true,
		},
	});

	return invites;
};
