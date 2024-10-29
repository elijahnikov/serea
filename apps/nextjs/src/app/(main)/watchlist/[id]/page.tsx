import { auth } from "@serea/auth";
import { Suspense } from "react";
import SingleWatchlist from "~/components/pages/watchlist";
import WatchlistLoadingSkeleton from "~/components/pages/watchlist/components/loading-skeleton";
import { cookies } from "next/headers";

import { api, HydrateClient } from "~/trpc/server";
import { getWatchlist } from "~/queries/watchlist/get-watchlist";
import { getWatchlistEntries } from "~/queries/watchlist/get-watchlist-entries";

export const runtime = "edge";

export default async function WatchlistPage({
	params,
}: { params: { id: string } }) {
	const session = await auth();

	const watchlist = await getWatchlist({ id: params.id });
	const watchlistEntries = await getWatchlistEntries({
		id: params.id,
	});
	const cookieStore = cookies();
	const view = cookieStore.get("selected-view");

	return (
		<Suspense fallback={<WatchlistLoadingSkeleton />}>
			<SingleWatchlist
				view={view?.value}
				id={params.id}
				currentUserId={session?.user.id}
				watchlist={watchlist}
				watchlistEntries={watchlistEntries}
			/>
		</Suspense>
	);
}
