"use client";

import type { RouterOutputs } from "@serea/api";
import Badge from "@serea/ui/badge";
import moment from "moment";
import { useState } from "react";
import { api } from "~/trpc/react";
import Actions from "../actions";
import Entries from "../entries";
import Description from "./editing/description";
import Title from "./editing/title";

export default function MainSection({
	isOwner = false,
	initialWatchlist,
	view,
	initialEntries,
	initialLikes,
}: {
	initialWatchlist: RouterOutputs["watchlist"]["get"];
	initialEntries: RouterOutputs["watchlist"]["getEntries"];
	initialLikes: RouterOutputs["watchlist"]["getLikes"];
	view: "grid" | "row" | null;
	isOwner?: boolean;
}) {
	const [selectedView, setSelectedView] = useState<"grid" | "row">(
		view ?? "grid",
	);

	const { data: watchlist } = api.watchlist.get.useQuery(
		{
			id: initialWatchlist.id,
		},
		{
			initialData: initialWatchlist ?? undefined,
		},
	);

	const { data: entries } = api.watchlist.getEntries.useQuery(
		{
			id: watchlist.id,
		},
		{
			initialData: initialEntries ?? undefined,
		},
	);
	return (
		<div className="gap-6 flex flex-col">
			<div className="mt-4">
				<Title isOwner={isOwner} watchlist={{ ...watchlist }} />
				<div className="flex gap-2 mt-2">
					<Badge stroke className="text-xs text-secondary-500">
						<span>Created</span>{" "}
						<span className="font-semibold text-black dark:text-white">
							{moment(watchlist.createdAt).format("MMMM Do YYYY")}
						</span>
					</Badge>
					<Badge stroke className="text-xs text-secondary-500">
						<span>Updated</span>{" "}
						<span className="font-semibold text-black dark:text-white">
							{moment(watchlist.updatedAt).format("MMMM Do YYYY")}
						</span>
					</Badge>
				</div>
				<Description isOwner={isOwner} watchlist={{ ...watchlist }} />
			</div>
			<Actions
				setSelectedView={setSelectedView}
				watchlistId={watchlist.id}
				watchlistTitle={watchlist.title}
				initialLikes={initialLikes}
			/>
			<Entries
				watchlistId={watchlist.id}
				view={selectedView}
				entries={entries}
			/>
		</div>
	);
}
