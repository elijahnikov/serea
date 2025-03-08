import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui/cn";
import { ListIcon } from "lucide-react";

export default function EventHeader({
	event,
}: {
	event: RouterOutputs["watchEvent"]["getEvent"];
}) {
	return (
		<div className={cn("pl-8 pr-8 border-b flex flex-col py-4 relative")}>
			<div className="flex items-center w-full mb-4 mt-2 text-carbon-900">
				<div className="flex items-center gap-2 mb-2 text-carbon-900">
					<ListIcon className="w-4 h-4" />
					<p className="font-mono text-xs">WATCHLIST</p>
				</div>
			</div>
		</div>
	);
}
