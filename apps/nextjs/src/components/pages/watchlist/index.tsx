"use client";

import FooterActions from "./footer-actions";
import WatchlistTags from "./tags";
import ImageGrid from "./image-grid";
import WatchlistHeader from "./header";
import MainText from "./main-text";
import { api } from "~/trpc/react";

export default function SingleWatchlist({ id }: { id: string }) {
	const [watchlist] = api.watchlist.get.useSuspenseQuery({ id });
	const [watchlistEntries] = api.watchlist.getEntries.useSuspenseQuery({ id });

	if (!watchlist) {
		return null;
	}

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="w-[60vw] max-w-[1000px] pt-8">
				<WatchlistHeader {...watchlist} />
				<div className="flex">
					<div className="w-full pr-8">
						<MainText {...watchlist} />
						<FooterActions watchlistId={watchlist.id} />
						<ImageGrid
							watchlistId={watchlist.id}
							entries={watchlistEntries}
							isOwner={true}
						/>
					</div>
					<div className="w-[30%] mt-10 min-w-[200px]">
						<WatchlistTags tags={watchlist.tags} />
					</div>
				</div>
			</div>
		</div>
	);
}