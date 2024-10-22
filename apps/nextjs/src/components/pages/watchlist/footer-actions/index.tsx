import type { RouterOutputs } from "@serea/api";
import LikeButton from "./like-button";
import SharePopover from "./share-popover";
import CloneList from "./clone-list";

export default function FooterActions({
	likeCount,
	isLiked,
	id,
}: NonNullable<RouterOutputs["watchlist"]["get"]>) {
	return (
		<div className="flex space-x-2 mb-4">
			<LikeButton likeCount={likeCount} isLiked={isLiked} id={id} />
			<SharePopover id={id} />
			<CloneList id={id} />
		</div>
	);
}
