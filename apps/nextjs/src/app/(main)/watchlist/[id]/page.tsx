"use server";

import { Suspense } from "react";
import SingleWatchlist from "~/components/pages/watchlist";

export default async function WatchlistPage({
	params,
}: { params: { id: string } }) {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<SingleWatchlist id={params.id} />
		</Suspense>
	);
}
