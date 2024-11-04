import { cn } from "@serea/ui";
import { Button } from "@serea/ui/button";
import { Heart } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toggleWatchlistLikeAction } from "~/actions/watchlist/toggle-watchlist-like";

export default function LikeButton({
	likeCount,
	isLiked,
	id,
}: {
	likeCount: number;
	isLiked: boolean;
	id: string;
}) {
	const [_isLiked, setIsLiked] = useState(isLiked);
	const [_likeCount, setLikeCount] = useState(likeCount);

	const toggleLike = useAction(toggleWatchlistLikeAction, {
		onExecute: () => {
			setIsLiked((prev) => !prev);
			setLikeCount((prev) => (_isLiked ? prev - 1 : prev + 1));
		},
		onError: () => {
			setIsLiked(isLiked);
			setLikeCount(likeCount);
		},
	});

	return (
		<Button
			onClick={() => toggleLike.execute({ watchlistId: id })}
			size={"xs-icon"}
			variant={"tertiary"}
			className={cn(_isLiked && "bg-red-100")}
		>
			<div className="flex items-center space-x-1">
				<Heart
					size={18}
					className={cn(
						_isLiked
							? "fill-red-500 text-red-500"
							: "fill-neutral-400 text-neutral-400",
					)}
				/>
				<p className="text-neutral-600">{_likeCount}</p>
			</div>
		</Button>
	);
}
