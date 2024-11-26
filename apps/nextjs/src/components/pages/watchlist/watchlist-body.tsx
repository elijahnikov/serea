"use client";

import type { RouterOutputs } from "@serea/api";
import { api } from "~/trpc/react";
import { useState } from "react";
import MainSection from "./main-section";

export default function WatchlistBody({
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
		<MainSection
			isOwner={isOwner}
			initialEntries={entries}
			view={selectedView}
			watchlist={watchlist}
			initialLikes={initialLikes}
		/>
	);
}
