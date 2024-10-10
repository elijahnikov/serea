import { Button } from "@serea/ui/button";
import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import { Heart, Forward, Copy } from "lucide-react";

export default function FooterActions({
	watchlistId,
}: { watchlistId: string }) {
	return (
		<TooltipProvider>
			<div className="flex space-x-2 mb-4">
				<TooltipRoot>
					<TooltipTrigger asChild>
						<Button size={"xs-icon"} variant={"tertiary"}>
							<div className="flex items-center space-x-1">
								<Heart
									size={18}
									className="fill-neutral-400 text-neutral-400"
								/>
								<p className="text-neutral-600">0</p>
							</div>
						</Button>
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
