import { Suspense } from "react";
import WatchlistLoadingSkeleton from "~/components/pages/watchlist/components/loading-skeleton";

import WatchlistPageData from "~/components/pages/watchlist/watchlist-data";

export const runtime = "edge";

export default async function WatchlistPage({
	params,
}: { params: { id: string } }) {
	return (
		<Suspense fallback={<WatchlistLoadingSkeleton />}>
			<WatchlistPageData id={params.id} />
		</Suspense>
	);
}
