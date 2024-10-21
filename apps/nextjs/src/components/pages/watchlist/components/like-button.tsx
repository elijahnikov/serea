import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui";
import { Button } from "@serea/ui/button";
import { Heart } from "lucide-react";
import { api } from "~/trpc/react";

export default function LikeButton({
	likeCount,
	isLiked,
	id,
}: {
	likeCount: number;
	isLiked: boolean;
	id: string;
}) {
	const trpcUtils = api.useUtils();
	const toggleLike = api.watchlist.toggleLike.useMutation({
		onMutate: async ({ watchlistId }) => {
			// Cancel outgoing refetches
			await trpcUtils.watchlist.get.cancel({ id: watchlistId });

			// Get the current data
			const previousData = trpcUtils.watchlist.get.getData({ id: watchlistId });

			// Optimistically update the UI
			trpcUtils.watchlist.get.setData({ id: watchlistId }, (old) => {
				if (!old) return old;
				return {
					...old,
					isLiked: !old.isLiked,
					likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
				};
			});

			// Return the previous data for rollback in case of error
			return { previousData };
		},
		onError: (err, newTodo, context) => {
			// If there's an error, rollback to the previous state
			if (context?.previousData) {
				trpcUtils.watchlist.get.setData({ id }, context.previousData);
			}
		},
		onSettled: async () => {
			// Refetch after mutation to ensure server-client consistency
			await trpcUtils.watchlist.get.invalidate({ id });
		},
	});

	return (
		<Button
			onClick={() => toggleLike.mutate({ watchlistId: id })}
			size={"xs-icon"}
			variant={"tertiary"}
			className={cn(isLiked && "bg-red-100")}
		>
			<div className="flex items-center space-x-1">
				<Heart
					size={18}
					className={cn(
						isLiked
							? "fill-red-500 text-red-500"
							: "fill-neutral-400 text-neutral-400",
					)}
				/>
				<p className="text-neutral-600">{likeCount}</p>
			</div>
		</Button>
	);
}
