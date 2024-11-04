import type { GetWatchlistReturnType } from "~/queries/watchlist/get-watchlist";
import SharePopover from "./share-popover";
import type { ListInvitesReturnType } from "~/queries/members/list-invites";
import type { ListMembersReturnType } from "~/queries/members/list-members";

export default function ShareWatchlist({
	watchlistId,
	owner,
	isOwner,
	members,
	invites,
}: {
	watchlistId: string;
	owner: NonNullable<GetWatchlistReturnType>["user"];
	isOwner: boolean;
	members: ListMembersReturnType;
	invites: ListInvitesReturnType;
}) {
	return (
		<SharePopover
			watchlistId={watchlistId}
			isOwner={isOwner}
			members={members}
			invites={invites}
		/>
	);
}
