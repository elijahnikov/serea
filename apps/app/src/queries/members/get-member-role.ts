import { auth } from "@serea/auth";
import { and, eq } from "@serea/db";
import { db } from "@serea/db/client";
import { WatchlistMember } from "@serea/db/schema";
import { unstable_cache } from "next/cache";
import type { GetMemberRole } from "@serea/schemas/members";

export const getMemberRole = async (params: GetMemberRole) => {
	const session = await auth();
	if (!session?.user) {
		return null;
	}

	return unstable_cache(
		async () => {
			return getMemberRoleQuery({ ...params, userId: session.user.id });
		},
		["get-member-role", session.user.email],
		{
			tags: [`get-member-role_${params.watchlistId}_${session.user.email}`],
		},
	);
};

const getMemberRoleQuery = async (
	params: GetMemberRole & { userId: string },
) => {
	const member = await db.query.WatchlistMember.findFirst({
		where: and(
			eq(WatchlistMember.watchlistId, params.watchlistId),
			eq(WatchlistMember.userId, params.userId),
		),
	});
	if (!member) {
		return "non-member";
	}

	return member.role;
};
