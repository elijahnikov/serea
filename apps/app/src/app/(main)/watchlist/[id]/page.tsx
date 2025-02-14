import { Suspense } from "react";
import Watchlist from "~/components/pages/watchlist";
import { HydrateClient, api } from "~/trpc/server";

export default async function WatchlistPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	void api.watchlist.get.prefetch({ id });
	void api.watchlist.getEntries.prefetch({ watchlistId: id });
	void api.watchlist.getMembers.prefetch({ id });
	void api.watchlist.getComments.prefetch({ id });

	return (
		<HydrateClient>
			<Suspense fallback={<div>Loading...</div>}>
				<Watchlist id={id} />
			</Suspense>
		</HydrateClient>
	);
}
