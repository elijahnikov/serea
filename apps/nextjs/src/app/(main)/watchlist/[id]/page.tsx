"use server";

import { auth } from "@serea/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SingleWatchlist from "~/components/pages/watchlist";
import { api, HydrateClient } from "~/trpc/server";

export default async function WatchlistPage({
	params,
}: { params: { id: string } }) {
	const session = await auth();
	void api.watchlist.get.prefetch({ id: params.id });
	void api.watchlist.getEntries.prefetch({ id: params.id });

	return (
		<HydrateClient>
			<Suspense fallback={"1"}>
				<SingleWatchlist id={params.id} currentUserId={session?.user.id} />
			</Suspense>
		</HydrateClient>
	);
}
