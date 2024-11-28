import type { RouterOutputs } from "@serea/api";
import { ToggleGroup, ToggleGroupItem } from "@serea/ui/toggle-group";
import { GridIcon, RowsIcon } from "lucide-react";
import { api } from "~/trpc/react";
import CloneButton from "./clone-button";
import LikeButton from "./like-button";
import ShareButton from "./share-button";
import ViewToggle from "./view-toggle";

export default function Actions({
	initialLikes,
	watchlistId,
	watchlistTitle,
	setSelectedView,
}: {
	initialLikes: RouterOutputs["watchlist"]["getLikes"];
	watchlistId: string;
	watchlistTitle: string;
	setSelectedView: (view: "grid" | "row") => void;
}) {
	const likes = api.watchlist.getLikes.useQuery(
		{
			id: watchlistId,
		},
		{ initialData: initialLikes, staleTime: Number.POSITIVE_INFINITY },
	);
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-2">
				<LikeButton
					hasLiked={likes.data.hasLiked}
					count={likes.data.count}
					watchlistId={watchlistId}
				/>
				<ShareButton watchlistId={watchlistId} />
				<CloneButton
					watchlistTitle={watchlistTitle}
					watchlistId={watchlistId}
				/>
			</div>
			<ViewToggle setSelectedView={setSelectedView} />
		</div>
	);
}
