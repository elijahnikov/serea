"use server";

import { getSession } from "@serea/auth";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { api } from "~/trpc/server";
import WatchlistHeader from "./header";

export default async function SingleWatchlist({ id }: { id: string }) {
	const session = await getSession();

	const watchlist = await api.watchlist.get({ id });
	const entries = await api.watchlist.getEntries({ id });
	const likes = await api.watchlist.getLikes({ id });

	const cookieStore = cookies();
	const view = cookieStore.get("selected-view");

	return (
		<>
			<Suspense fallback={<p>loading2...</p>}>
				<WatchlistHeader
					owner={watchlist.user}
					isOwner={session?.user.id === watchlist.userId}
					watchlistId={watchlist.id}
				/>
			</Suspense>
		</>
	);
}
