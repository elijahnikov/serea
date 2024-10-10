import { Button } from "@lemonsqueezy/wedges";
import type { RouterOutputs } from "@serea/api";
import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import { Share } from "lucide-react";

export default function WatchlistHeader({
	user,
}: NonNullable<RouterOutputs["watchlist"]["get"]>) {
	return (
		<div className="flex w-full justify-between items-center">
			<div className="flex items-center">
				<AvatarRoot>
					<AvatarWedges
						size="xs"
						src={user.image ?? undefined}
						alt={`Navigation profile picture for ${user.name}`}
					/>
				</AvatarRoot>
				<p className="text-xs -ml-2">
					List by <span className="font-medium">{user.name}</span>
				</p>
			</div>
			<Button size={"xs-icon"} variant={"outline"}>
				<div className="flex items-center space-x-1">
					<Share size={16} />
					<p>Share</p>
				</div>
			</Button>
		</div>
	);
}
