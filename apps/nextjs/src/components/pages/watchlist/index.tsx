"use client";

import WatchlistTags from "./components/tags";

import WatchlistHeader from "./components/header";
import MainText from "./components/main-text";
import { api } from "~/trpc/react";
import EntryGrid from "./entries/entry-grid";
import MemberList from "./components/member-list";
import NonMemberEntryGrid from "./entries/non-member-entry-grid";
import FooterActions from "./footer-actions";
import { useState } from "react";
import EntryRows from "./entries/entry-rows";

export default function SingleWatchlist({
	id,
	currentUserId,
	view,
}: { id: string; currentUserId?: string; view?: string }) {
	const [selectedView, setSelectedView] = useState<string>(view || "grid");

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
						<FooterActions
							selectedView={selectedView}
							setSelectedView={setSelectedView}
							{...watchlist}
						/>
						{["owner", "editor", "viewer"].includes(role) ? (
							selectedView === "grid" ? (
								<EntryGrid
									watchlistId={watchlist.id}
									entries={watchlistEntries}
									role={role}
								/>
							) : (
								<EntryRows
									entries={watchlistEntries}
									role={role}
									watchlistId={watchlist.id}
								/>
							)
						) : selectedView === "grid" ? (
							<NonMemberEntryGrid entries={watchlistEntries} />
						) : null}
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
