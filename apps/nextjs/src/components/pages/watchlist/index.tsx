"use client";

import FooterActions from "./footer-actions";
import WatchlistTags from "./components/tags";

import WatchlistHeader from "./components/header";
import MainText from "./components/main-text";
import { api } from "~/trpc/react";
import ImageGrid from "./image-grid";
import MemberList from "./components/member-list";
import NonMemberImageGrid from "./non-member-image-grid";

export default function SingleWatchlist({
	id,
	currentUserId,
}: { id: string; currentUserId?: string }) {
	const [watchlist] = api.watchlist.get.useSuspenseQuery({ id });
	const [watchlistEntries] = api.watchlist.getEntries.useSuspenseQuery(
		{ id },
		{ refetchInterval: 60000 },
	);
	const [role] = api.members.getMemberRole.useSuspenseQuery({
		watchlistId: id,
	});

	if (!watchlist) {
		return null;
	}

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="w-[60vw] max-w-[1000px] pt-8">
				<WatchlistHeader
					isOwner={currentUserId === watchlist.user.id}
					owner={watchlist.user}
					watchlistId={watchlist.id}
				/>
				<div className="flex">
					<div className="w-full pr-8">
						<MainText {...watchlist} />
						<FooterActions {...watchlist} />
						{["owner", "editor", "viewer"].includes(role) ? (
							<ImageGrid
								watchlistId={watchlist.id}
								entries={watchlistEntries}
								role={role}
							/>
						) : (
							<NonMemberImageGrid entries={watchlistEntries} />
						)}
					</div>
					<div className="w-[30%] mt-10 space-y-8 min-w-[200px]">
						<MemberList watchlistId={watchlist.id} />
						<WatchlistTags tags={watchlist.tags} />
					</div>
				</div>
			</div>
		</div>
	);
}
