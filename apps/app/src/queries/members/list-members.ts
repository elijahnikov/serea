import { auth } from "@serea/auth";
import { and, desc, eq } from "@serea/db";
import { db } from "@serea/db/client";
import { WatchlistMember } from "@serea/db/schema";
import { unstable_cache } from "next/cache";
import { z } from "zod";

const listMembersSchema = z.object({
	watchlistId: z.string(),
});
export type ListMembersSchemaType = z.infer<typeof listMembersSchema>;
export type ListMembersReturnType = Awaited<ReturnType<typeof listMembers>>;

export const listMembers = async (params: ListMembersSchemaType) => {
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

const listMembersQuery = async (
	params: ListMembersSchemaType & { userId: string },
) => {
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
