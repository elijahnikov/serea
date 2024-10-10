import type { RouterOutputs } from "@serea/api";
import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import Badge from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import { Clock, RotateCw, Share } from "lucide-react";
import moment from "moment";
import FooterActions from "./footer-actions";
import WatchlistTags from "./tags";
import ImageGrid from "./image-grid";
import WatchlistHeader from "./header";
import MainText from "./main-text";

export default function SingleWatchlist({
	watchlist,
	isOwner,
}: {
	watchlist: NonNullable<RouterOutputs["watchlist"]["get"]>;
	isOwner: boolean;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="w-[60vw] max-w-[1000px] pt-8">
				<WatchlistHeader {...watchlist} />
				<div className="flex">
					<div className="w-full pr-8">
						<MainText {...watchlist} />
						<FooterActions watchlistId={watchlist.id} />
						<ImageGrid entries={watchlist.entries} isOwner={isOwner} />
					</div>
					<div className="w-[30%] mt-10 min-w-[200px]">
						<WatchlistTags tags={watchlist.tags} />
					</div>
				</div>
			</div>
		</div>
	);
}
