"use client";

import { cn } from "@serea/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ToolbarTooltip } from "~/components/navigation/invites";
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
		<Popover>
			<PopoverTrigger>
				<ToolbarTooltip side="top" content="Clone list">
					<div
						className={cn(
							"group inline-flex shrink-0 select-none items-center justify-center text-sm font-medium leading-6 transition-colors duration-100 wg-antialiased focus:outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none",
							"gap-0 px-8px py-1 text-neutral-500 relative h-9 w-9",
							"bg-surface hover:bg-surface-100 rounded-lg",
						)}
					>
						<UserPlus size={18} className="stroke-[2px]" />
					</div>
				</ToolbarTooltip>
			</PopoverTrigger>
			<PopoverContent
				className="focus:outline-none min-w-[400px] max-h-[400px] overflow-y-auto focus:ring-0 relative -top-1.5 space-y-2"
				side="right"
			>
				<button type="button" onClick={() => cloneWatchlist.mutate({ id })}>
					hello
				</button>
			</PopoverContent>
		</Popover>
	);
}
