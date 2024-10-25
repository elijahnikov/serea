import type { RouterOutputs } from "@serea/api";
import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import ShareWatchlist from "../share";
import { Button } from "@serea/ui/button";
import { Settings } from "lucide-react";

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
				<p className="text-sm -ml-2">
					List by <span className="font-medium">{owner.name}</span>
				</p>
			</div>

			<div className="flex items-center gap-2">
				{isOwner ? (
					<Button size={"xs-icon"} variant={"tertiary"} className="border">
						<div className="flex items-center space-x-1">
							<Settings size={16} />
							<p>Settings</p>
						</div>
					</Button>
				) : null}
				{isOwner ? (
					<ShareWatchlist
						isOwner={isOwner}
						owner={owner}
						watchlistId={watchlistId}
					/>
				) : null}
			</div>
		</div>
	);
}
