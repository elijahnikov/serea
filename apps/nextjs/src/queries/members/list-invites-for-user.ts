import { auth } from "@serea/auth";
import { eq } from "@serea/db";
import { db } from "@serea/db/client";
import { WatchlistInvitation } from "@serea/db/schema";
import { unstable_cache } from "next/cache";

export const listInvitesForUser = async () => {
	const session = await auth();
	if (!session?.user) {
		return null;
	}

	return unstable_cache(async () => {
		return listInvitesForUserQuery({ userId: session.user.id });
	}, ["list-invites-for-user", session.user.email]);
};

const listInvitesForUserQuery = async (params: { userId: string }) => {
	const invites = await db.query.WatchlistInvitation.findMany({
		where: eq(WatchlistInvitation.inviteeId, params.userId),
		with: {
			inviter: {
				columns: {
					name: true,
					email: true,
					image: true,
				},
			},
			watchlist: {
				columns: {
					id: true,
					title: true,
				},
			},
		},
	});
	return invites;
};
