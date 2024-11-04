"use client";

import Badge from "@serea/ui/badge";
import { Clock, RotateCw } from "lucide-react";
import moment from "moment";
import type { GetWatchlistReturnType } from "~/queries/watchlist/get-watchlist";
import FooterActions from "../footer-actions";
import { useState } from "react";
import EntryGrid from "../entries/entry-grid";
import EntryRows from "../entries/entry-rows";
import NonMemberEntryGrid from "../entries/non-member-entry-grid";
import type { GetWatchlistEntriesReturnType } from "~/queries/watchlist/get-watchlist-entries";

export default function MainWatchlistView({
	watchlist,
	view,
	watchlistEntries,
}: {
	watchlist: NonNullable<GetWatchlistReturnType>;
	view?: string;
	watchlistEntries: GetWatchlistEntriesReturnType;
}) {
	const [selectedView, setSelectedView] = useState<string>(view ?? "grid");
	const { title, createdAt, updatedAt, description } = watchlist;
	return (
		<>
			<p className="font-semibold tracking-tight text-neutral-800 text-balance text-2xl mt-2">
				{title}
			</p>
			<div className="flex items-center my-2 space-x-2">
				<Badge>
					<div className="flex items-center space-x-1">
						<Clock size={12} className="text-neutral-500" />
						<p className="text-xs font-medium text-neutral-500">
							Created{" "}
							<span className="text-black">
								{moment(createdAt).format("MMMM Do YYYY")}
							</span>
						</p>
					</div>
				</Badge>
				<Badge>
					<div className="flex items-center space-x-1">
						<RotateCw size={12} className="text-neutral-500" />
						<p className="text-xs font-medium text-neutral-500">
							Last updated{" "}
							<span className="text-black">
								{moment(updatedAt).format("MMMM Do YYYY")}
							</span>
						</p>
					</div>
				</Badge>
			</div>
			<p className=" text-neutral-500 mt-2 mb-4 text-md">{description}</p>
			<FooterActions
				selectedView={selectedView}
				setSelectedView={setSelectedView}
				{...watchlist}
			/>
			{watchlistEntries &&
				(["owner", "editor", "viewer"].includes("owner") ? (
					selectedView === "grid" ? (
						// biome-ignore lint/a11y/useValidAriaRole: <explanation>
						<EntryGrid
							watchlistId={watchlist.id}
							entries={watchlistEntries}
							role={"owner"}
						/>
					) : (
						// biome-ignore lint/a11y/useValidAriaRole: <explanation>
						<EntryRows
							entries={watchlistEntries}
							role={"owner"}
							watchlistId={watchlist.id}
						/>
					)
				) : selectedView === "grid" ? (
					<NonMemberEntryGrid entries={watchlistEntries} />
				) : null)}
		</>
	);
}
