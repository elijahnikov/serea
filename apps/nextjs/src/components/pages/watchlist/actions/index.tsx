import type { RouterOutputs } from "@serea/api";
import LikeButton from "./like-button";
import { api } from "~/trpc/react";

export default function Actions({
	initialLikes,
	watchlistId,
}: {
	initialLikes: RouterOutputs["watchlist"]["getLikes"];
	watchlistId: string;
}) {
	const likes = api.watchlist.getLikes.useQuery(
		{
			id: watchlistId,
		},
		{ initialData: initialLikes, staleTime: Number.POSITIVE_INFINITY },
	);
	return (
		<div className="flex items-center gap-2">
			<LikeButton
				hasLiked={likes.data.hasLiked}
				count={likes.data.count}
				watchlistId={watchlistId}
			/>
		</div>
	);
}
