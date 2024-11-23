"use client";

import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import { Heart } from "lucide-react";
import { api } from "~/trpc/react";

export default function LikeButton({
	count,
	hasLiked,
	watchlistId,
}: {
	count: number;
	hasLiked: boolean;
	watchlistId: string;
}) {
	const trpcUtils = api.useUtils();
	const toggleLike = api.watchlist.toggleLike.useMutation({
		onMutate: async ({ watchlistId }) => {
			await trpcUtils.watchlist.getLikes.cancel({ id: watchlistId });
			const previousData = trpcUtils.watchlist.getLikes.getData({
				id: watchlistId,
			});
			trpcUtils.watchlist.getLikes.setData({ id: watchlistId }, (old) => {
				if (!old)
					return {
						count: hasLiked ? count - 1 : count + 1,
						hasLiked: !hasLiked,
					};
				return {
					count: hasLiked ? count - 1 : count + 1,
					hasLiked: !hasLiked,
				};
			});
			return { previousData };
		},
		onError: (_, __, context) => {
			if (context?.previousData) {
				trpcUtils.watchlist.getLikes.setData(
					{ id: watchlistId },
					context.previousData,
				);
			}
		},
		onSettled: () => {
			trpcUtils.watchlist.getLikes.invalidate({ id: watchlistId });
		},
	});

	return (
		<Button
			onClick={() => toggleLike.mutate({ watchlistId })}
			size={"xs-icon"}
			variant={"tertiary"}
			disabled={toggleLike.isPending}
			className={cn(
				hasLiked && "bg-red-100 dark:bg-red-900",
				toggleLike.isPending && "cursor-not-allowed",
			)}
		>
			<div className="flex items-center space-x-1">
				<Heart
					size={18}
					className={cn(
						hasLiked
							? "fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400"
							: "fill-neutral-400 dark:fill-neutral-500 text-neutral-400 dark:text-neutral-500",
					)}
				/>
				<p className="text-neutral-600 dark:text-neutral-400">{count}</p>
			</div>
		</Button>
	);
}
