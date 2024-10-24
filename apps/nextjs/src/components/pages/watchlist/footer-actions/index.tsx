import type { RouterOutputs } from "@serea/api";
import LikeButton from "./like-button";
import SharePopover from "./share-popover";
import CloneList from "./clone-list";
import ViewToggle from "./view-toggle";

export default function FooterActions({
	likeCount,
	isLiked,
	id,
}: NonNullable<RouterOutputs["watchlist"]["get"]>) {
	return (
		<div className="flex justify-between mb-2">
			<div className="flex items-center gap-2">
				<LikeButton likeCount={likeCount} isLiked={isLiked} id={id} />
				<SharePopover id={id} />
				<CloneList id={id} />
			</div>
			<div className="flex items-center gap-2">
				<ViewToggle />
			</div>
		</div>
	);
}
