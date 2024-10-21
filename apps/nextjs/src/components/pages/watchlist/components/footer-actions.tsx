import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import { Heart, Forward, Copy } from "lucide-react";
import LikeButton from "./like-button";

export default function FooterActions({
	likeCount,
	isLiked,
	id,
}: NonNullable<RouterOutputs["watchlist"]["get"]>) {
	return (
		<TooltipProvider>
			<div className="flex space-x-2 mb-4">
				<TooltipRoot>
					<TooltipTrigger asChild>
						<LikeButton likeCount={likeCount} isLiked={isLiked} id={id} />
					</TooltipTrigger>
					<TooltipContent className="relative -left-2">Like</TooltipContent>
				</TooltipRoot>

				<TooltipRoot>
					<TooltipTrigger asChild>
						<Button size={"xs-icon"} variant={"tertiary"}>
							<Forward size={18} className=" text-neutral-400" />
						</Button>
					</TooltipTrigger>
					<TooltipContent className="relative -left-2">Share</TooltipContent>
				</TooltipRoot>
				<TooltipRoot>
					<TooltipTrigger asChild>
						<Button size={"xs-icon"} variant={"tertiary"}>
							<Copy size={18} className=" text-neutral-400" />
						</Button>
					</TooltipTrigger>
					<TooltipContent className="relative -left-2">
						Clone list
					</TooltipContent>
				</TooltipRoot>
			</div>
		</TooltipProvider>
	);
}
