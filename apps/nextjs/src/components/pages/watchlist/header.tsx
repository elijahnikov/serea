import type { RouterOutputs } from "@serea/api";
import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import ShareWatchlist from "./share";

export default function WatchlistHeader({
	owner,
	watchlistId,
	isOwner,
}: {
	owner: NonNullable<RouterOutputs["watchlist"]["get"]>["user"];
	isOwner: boolean;
	watchlistId: string;
}) {
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
				<p className="text-xs -ml-2">
					List by <span className="font-medium">{owner.name}</span>
				</p>
			</div>

			{isOwner ? (
				<ShareWatchlist
					isOwner={isOwner}
					owner={owner}
					watchlistId={watchlistId}
				/>
			) : null}
		</div>
	);
}
