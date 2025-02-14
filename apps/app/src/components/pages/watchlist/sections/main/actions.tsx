import { Button } from "@serea/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";
import {
	CopyIcon,
	ForwardIcon,
	HeartIcon,
	MessageCircleIcon,
	Repeat2Icon,
} from "lucide-react";
import { SOCIAL_LINKS_ICONS } from "~/lib/constants";
import { formatNumber } from "~/lib/utils/general";
import { api } from "~/trpc/react";

export default function WatchlistActions({
	watchlistId,
	likes,
	isLiked,
	comments,
}: {
	watchlistId: string;
	likes: number;
	isLiked: boolean;
	comments: number;
}) {
	const scrollToComments = () => {
		const commentsSection = document.getElementById("comments-section");
		if (commentsSection) {
			commentsSection.scrollIntoView({ behavior: "smooth" });
		}
	};

	const utils = api.useUtils();
	const like = api.watchlist.like.useMutation({
		onMutate: async ({ id }) => {
			await utils.watchlist.get.cancel({ id });
			const previousData = utils.watchlist.get.getData({ id });
			utils.watchlist.get.setData({ id }, (old) => {
				if (!old) return old;
				return {
					...old,
					_count: {
						...old._count,
						likes: old._count.likes + (isLiked ? -1 : 1),
					},
					liked: !isLiked,
				};
			});

			return { previousData };
		},
		onError: (_, __, context) => {
			if (context?.previousData) {
				utils.watchlist.get.setData({ id: watchlistId }, context.previousData);
			}
		},
		onSettled: () => {
			utils.watchlist.get.invalidate({ id: watchlistId });
		},
	});

	return (
		<div className="flex mt-4 gap-2 items-center">
			<Button
				variant="outline"
				onClick={() => like.mutate({ id: watchlistId })}
			>
				<div className="flex">
					<HeartIcon
						data-liked={isLiked}
						className="data-[liked=true]:fill-red-500 data-[liked=true]:text-red-500 data-[liked=false]:opacity-60"
						size={16}
						strokeWidth={2}
						aria-hidden="true"
					/>
					<span className="border-l dark:hover:border-carbon-dark-500 text-xs font-mono flex items-center justify-center ms-2.5 pl-3 -my-2">
						{formatNumber(likes)}
					</span>
				</div>
			</Button>
			<Button variant="outline" onClick={scrollToComments}>
				<div className="flex">
					<MessageCircleIcon className="opacity-60" size={16} strokeWidth={2} />
					<span className="border-l dark:hover:border-carbon-dark-500 text-xs font-mono flex items-center justify-center ms-2.5 pl-3 -my-2">
						{formatNumber(comments)}
					</span>
				</div>
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button before={<ForwardIcon />} variant="outline">
						Share
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem>
						<Repeat2Icon size={14} />
						<span>Repost</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<CopyIcon size={14} />
						<span>Copy link</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						{SOCIAL_LINKS_ICONS.TWITTER}
						<span>Share to Twitter</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
