"use client";

import MainSection from "./main-section";
import type { RouterOutputs } from "@serea/api";
import { api } from "~/trpc/react";
import { useState } from "react";
import Tags from "./tags";

export default function WatchlistBody({
	initialWatchlist,
	view,
	initialEntries,
	initialLikes,
}: {
	initialWatchlist: RouterOutputs["watchlist"]["get"];
	initialEntries: RouterOutputs["watchlist"]["getEntries"];
	initialLikes: RouterOutputs["watchlist"]["getLikes"];
	view: "grid" | "row" | null;
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
		<div className="flex flex-col gap-4 lg:flex-row">
			<MainSection
				initialEntries={entries}
				view={selectedView}
				watchlist={watchlist}
				initialLikes={initialLikes}
			/>
			<div className="w-full mt-16 lg:w-1/3 order-first lg:order-last">
				<Tags tags={watchlist.tags} />
			</div>
		</div>
	);
}