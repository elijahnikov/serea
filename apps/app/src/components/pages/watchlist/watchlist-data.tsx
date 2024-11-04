import { auth } from "@serea/auth";
import { cookies } from "next/headers";
import { getWatchlist } from "~/queries/watchlist/get-watchlist";
import { getWatchlistEntries } from "~/queries/watchlist/get-watchlist-entries";
import SingleWatchlist from ".";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import WatchlistHeader from "./components/header";

export default async function WatchlistPageData({ id }: { id: string }) {
	const session = await auth();

	const watchlist = await getWatchlist({ id });
	const watchlistEntries = await getWatchlistEntries({
		id,
	});

	const cookieStore = cookies();
	const view = cookieStore.get("selected-view");

	if (!watchlist) {
		notFound();
	}

	return (
		<SingleWatchlist
			view={view?.value}
			currentUserId={session?.user.id}
			watchlist={watchlist}
			watchlistEntries={watchlistEntries}
		/>
	);
}
