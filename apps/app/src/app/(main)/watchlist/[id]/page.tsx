import { Suspense } from "react";
import Watchlist from "~/components/pages/watchlist";
import { HydrateClient, api } from "~/trpc/server";

export default function WatchlistPage({ params }: { params: { id: string } }) {
	void api.watchlist.get.prefetch({ id: params.id });

	return (
		<HydrateClient>
			<Suspense fallback={<div>Loading...</div>}>
				<Watchlist id={params.id} />
			</Suspense>
		</HydrateClient>
	);
}
