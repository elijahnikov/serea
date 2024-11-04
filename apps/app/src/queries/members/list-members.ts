import { auth } from "@serea/auth";
import { and, desc, eq } from "@serea/db";
import { db } from "@serea/db/client";
import { WatchlistMember } from "@serea/db/schema";
import type { ListMembers } from "@serea/schemas/members";
import type { QueryReturnType } from "@serea/schemas/utils";
import { unstable_cache } from "next/cache";

export type ListMembersReturnType = QueryReturnType<typeof listMembers>;

export const listMembers = async (params: ListMembers) => {
	const session = await auth();
	if (!session?.user) {
		return null;
	}

	return unstable_cache(
		async () => {
			return listMembersQuery({ ...params, userId: session.user.id });
		},
		["list-members", session.user.email],
		{
			tags: [`list-members_${params.watchlistId}_${session.user.email}`],
		},
	)();
};

const listMembersQuery = async (params: ListMembers & { userId: string }) => {
	const isMemberOfWatchlist = await db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.userId, params.userId),
			eq(WatchlistMember.watchlistId, params.watchlistId),
		),
	});
	if (!isMemberOfWatchlist) {
		throw new Error("Not a member.");
	}

	const members = await db.query.WatchlistMember.findMany({
		where: eq(WatchlistMember.watchlistId, params.watchlistId),
		orderBy: desc(WatchlistMember.createdAt),
		with: {
			user: true,
		},
	});

	return members;
};
