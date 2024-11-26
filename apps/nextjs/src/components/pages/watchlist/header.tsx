import type { RouterOutputs } from "@serea/api";
import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import { api } from "~/trpc/server";
import AccessPopover from "./access-popover";

export default async function WatchlistHeader({
	owner,
	isOwner,
	watchlist,
}: {
	owner: RouterOutputs["watchlist"]["get"]["user"];
	isOwner: boolean;
	watchlist: Pick<
		RouterOutputs["watchlist"]["get"],
		"id" | "title" | "description" | "tags" | "isPrivate" | "hideStats"
	>;
}) {
	const [members, invites] = isOwner
		? await Promise.all([
				api.members.listMembers({ watchlistId: watchlist.id }),
				api.members.listInvites({ watchlistId: watchlist.id }),
			])
		: [null, null];

	return (
		<div className="flex items-center justify-between">
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

			{isOwner ? (
				<div className="flex items-center gap-2">
					<AccessPopover
						initialMembers={members}
						initialInvites={invites}
						watchlistId={watchlist.id}
					/>
				</div>
			) : null}
		</div>
	);
}
