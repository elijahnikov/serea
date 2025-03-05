import type { RouterOutputs } from "@serea/api";
import { Suspense } from "react";
import WatchlistDetails from "./details";
import WatchlistMembers from "./members";
import WatchlistTags from "./tags";

export default function SideSection({
	watchlist,
}: { watchlist: RouterOutputs["watchlist"]["get"] }) {
	return (
		<div className="fixed bg-transparent overflow-y-auto overflow-x-hidden max-h-screen space-y-8 px-6 right-0 min-h-screen max-w-[240px] min-w-[240px] border-l">
			<div id="owner-actions-portal" />
			<WatchlistDetails details={watchlist} />
			<WatchlistTags tags={watchlist} />
			<Suspense fallback={<div>Loading members...</div>}>
				<WatchlistMembers
					watchlist={watchlist}
					totalEntries={watchlist._count.entries}
				/>
			</Suspense>
		</div>
	);
}
