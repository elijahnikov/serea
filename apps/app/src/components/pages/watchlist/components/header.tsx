import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import ShareWatchlist from "../share";
import type { GetWatchlistReturnType } from "~/queries/watchlist/get-watchlist";
import { listInvites } from "~/queries/members/list-invites";
import { listMembers } from "~/queries/members/list-members";

export default async function WatchlistHeader({
	owner,
	watchlistId,
	isOwner,
}: {
	owner: NonNullable<GetWatchlistReturnType>["user"];
	isOwner: boolean;
	watchlistId: string;
}) {
	const [members, invites] = isOwner
		? await Promise.all([
				listMembers({ watchlistId }),
				listInvites({ watchlistId }),
			])
		: [null, null];

	return (
		<div className="flex w-full justify-between items-center">
			<div className="flex items-center">
				<AvatarRoot>
					<AvatarWedges
						size="xs"
						src={owner.image ?? undefined}
						alt={`Navigation profile picture for ${owner.name}`}
					/>
				</AvatarRoot>
				<p className="text-sm -ml-2">
					List by <span className="font-medium">{owner.name}</span>
				</p>
			</div>

			<div className="flex items-center gap-2">
				{isOwner && (
					<ShareWatchlist
						owner={owner}
						isOwner={isOwner}
						watchlistId={watchlistId}
						members={members}
						invites={invites}
					/>
				)}
			</div>
		</div>
	);
}
