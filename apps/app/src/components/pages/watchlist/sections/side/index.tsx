import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui/cn";
import { Suspense } from "react";
import { useChannelStore } from "~/stores/channel";
import WatchlistDetails from "./details";
import WatchlistMembers from "./members";
import WatchlistTags from "./tags";
import WatchlistEvents from "./watchlist-events";

export default function SideSection({
	watchlist,
}: { watchlist: RouterOutputs["watchlist"]["get"] }) {
	const { currentChannelId } = useChannelStore();
	return (
		<div
			className={cn(
				"fixed bg-transparent overflow-y-auto overflow-x-hidden max-h-screen space-y-8 px-6 min-h-screen max-w-[240px] min-w-[240px] border-l transition-all duration-300 ease-in-out",
				currentChannelId ? "right-[240px]" : "right-0",
			)}
		>
			<div id="owner-actions-portal" />
			<WatchlistDetails details={watchlist} />
			<WatchlistTags tags={watchlist} />
			{/* <Suspense fallback={<div>Loading events...</div>}>
				<WatchlistEvents watchlist={watchlist} />
			</Suspense> */}
			<Suspense fallback={<div>Loading members...</div>}>
				<WatchlistMembers
					watchlist={watchlist}
					totalEntries={watchlist._count.entries}
				/>
			</Suspense>
		</div>
	);
}
