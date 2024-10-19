"use server";

import { auth } from "@serea/auth";
import { Suspense } from "react";
import SingleWatchlist from "~/components/pages/watchlist";
import WatchlistLoadingSkeleton from "~/components/pages/watchlist/components/loading-skeleton";

import { api, HydrateClient } from "~/trpc/server";

export default async function WatchlistPage({
	params,
}: { params: { id: string } }) {
	const session = await auth();
	void api.watchlist.get.prefetch({ id: params.id });
	void api.watchlist.getEntries.prefetch({ id: params.id });
	void api.members.listMembers.prefetch({ watchlistId: params.id });
	void api.members.getMemberRole.prefetch({
		watchlistId: params.id,
	});

	return (
		<HydrateClient>
			<Suspense fallback={<WatchlistLoadingSkeleton />}>
				<SingleWatchlist id={params.id} currentUserId={session?.user.id} />
			</Suspense>
		</HydrateClient>
	);
}
