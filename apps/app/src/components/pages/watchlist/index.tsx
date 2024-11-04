"use server";

import WatchlistHeader from "./components/header";

import type { GetWatchlistReturnType } from "~/queries/watchlist/get-watchlist";
import type { GetWatchlistEntriesReturnType } from "~/queries/watchlist/get-watchlist-entries";
import MainWatchlistView from "./components/main-watchlist-view";
import { Suspense } from "react";
import WatchlistTags from "./components/tags";
import MembersProgress from "./components/member-progress";

export default async function SingleWatchlist({
	currentUserId,
	view,
	watchlist,
	watchlistEntries,
}: {
	currentUserId?: string;
	view?: string;
	watchlist: GetWatchlistReturnType;
	watchlistEntries: GetWatchlistEntriesReturnType;
}) {
	if (!watchlist) {
		return null;
	}

	return (
		<>
			<Suspense fallback={<p>loading</p>}>
				<WatchlistHeader
					isOwner={currentUserId === watchlist.user.id}
					owner={watchlist.user}
					watchlistId={watchlist.id}
				/>
			</Suspense>
			<div className="flex">
				<div className="w-full pr-8">
					<MainWatchlistView
						view={view}
						watchlist={watchlist}
						watchlistEntries={watchlistEntries}
					/>
				</div>
				<div className="w-[30%] mt-10 space-y-8 min-w-[200px]">
					<WatchlistTags tags={watchlist.tags} />
					<MembersProgress watchlistId={watchlist.id} />
				</div>
			</div>
		</>
	);
}
