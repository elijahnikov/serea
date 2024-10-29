"use server";

import { auth } from "@serea/auth";
import { Suspense } from "react";
import SingleWatchlist from "~/components/pages/watchlist";
import WatchlistLoadingSkeleton from "~/components/pages/watchlist/components/loading-skeleton";
import { cookies } from "next/headers";

import { api, HydrateClient } from "~/trpc/server";

export default async function WatchlistPage({
	params,
}: { params: { id: string } }) {
	const session = await auth();
	void api.watchlist.get.prefetch({ id: params.id });
	void api.members.getMemberRole.prefetch({
		watchlistId: params.id,
	});

	const cookieStore = cookies();
	const view = cookieStore.get("selected-view");

	return (
		<HydrateClient>
			<Suspense fallback={<WatchlistLoadingSkeleton />}>
				<SingleWatchlist
					view={view?.value}
					id={params.id}
					currentUserId={session?.user.id}
				/>
			</Suspense>
		</HydrateClient>
	);
}
