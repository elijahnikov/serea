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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function CloneList({ id }: { id: string }) {
	const router = useRouter();
	const cloneWatchlist = api.watchlist.clone.useMutation({
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
						onClick={() => cloneWatchlist.mutate({ id })}
						variant={"tertiary"}
						size="xs-icon"
						spinnerSize="xs"
						loading={cloneWatchlist.isPending}
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
