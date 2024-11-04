"use client";

import { LoadingButton } from "@serea/ui/loading-button";
import {
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
	TooltipPortal,
	TooltipContent,
	TooltipArrow,
} from "@serea/ui/tooltip";
import { Copy } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cloneWatchlistAction } from "~/actions/watchlist/clone-watchlist";

export default function CloneList({ id }: { id: string }) {
	const router = useRouter();
	const cloneWatchlist = useAction(cloneWatchlistAction, {
		onSuccess: (id) => {
			toast.success("Watchlist has been cloned! Redirecting...");
			router.push(`/watchlist/${id}`);
		},
	});
	return (
		<TooltipProvider>
			<TooltipRoot>
				<TooltipTrigger asChild>
					<LoadingButton
						onClick={() => cloneWatchlist.execute({ id })}
						variant={"tertiary"}
						size="xs-icon"
						spinnerSize="xs"
						loading={cloneWatchlist.isPending}
						className="h-8 w-8"
					>
						<Copy size={18} className="stroke-[2px] text-neutral-500" />
					</LoadingButton>
				</TooltipTrigger>
				<TooltipPortal>
					<TooltipContent side={"top"} content="" arrow>
						Clone list
						<TooltipArrow />
					</TooltipContent>
				</TooltipPortal>
			</TooltipRoot>
		</TooltipProvider>
	);
}
