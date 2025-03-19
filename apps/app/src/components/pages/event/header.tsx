import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui/cn";
import { ArrowLeftIcon, ArrowRightIcon, ListIcon } from "lucide-react";
import Link from "next/link";

export default function EventHeader({
	event,
}: {
	event: RouterOutputs["watchEvent"]["getEvent"];
}) {
	return (
		<div className={cn("pl-8 pr-8 border-b flex flex-col py-4 relative")}>
			<div className="flex items-center w-full mt-2 text-carbon-900">
				<div className="flex items-center gap-2 mb-2 text-carbon-900">
					<ListIcon className="w-4 h-4" />
					<p className="font-mono text-xs">WATCHLIST</p>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Link
					href={`/watchlist/${event.watchlist.id}`}
					className="group flex items-center"
				>
					<ArrowLeftIcon className="group-hover:opacity-100 opacity-0 group-hover:translate-x-0 translate-x-1 transition-all duration-300 w-4 h-4" />
					<h1 className="text-md group-hover:translate-x-1 -translate-x-1 transition-all duration-300 font-semibold">
						{event.watchlist.title}
					</h1>
				</Link>
			</div>
		</div>
	);
}
