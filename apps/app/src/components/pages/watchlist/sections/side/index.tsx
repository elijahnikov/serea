import type { RouterOutputs } from "@serea/api";
import { Suspense } from "react";
import WatchlistDetails from "./details";
import WatchlistMembers from "./members";
import OwnerActions from "./owner-actions";
import WatchlistTags from "./tags";

export default function SideSection({
	watchlist,
}: { watchlist: RouterOutputs["watchlist"]["get"] }) {
	return (
		<div className="fixed overflow-y-auto max-h-screen space-y-8 px-8 right-0 bg-background min-h-screen min-w-[240px] border-l">
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
