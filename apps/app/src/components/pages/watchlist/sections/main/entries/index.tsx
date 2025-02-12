"use client";

import { ListOrderedIcon } from "lucide-react";
import { useState } from "react";
import { SELECTED_VIEW_COOKIE_NAME } from "~/lib/constants";
import { api } from "~/trpc/react";
import GridList from "./grid-list";
import RowList from "./row-list";
import ViewToggle from "./view-toggle";

export default function EntriesSection({
	watchlistId,
}: {
	watchlistId: string;
}) {
	const [entries] = api.watchlist.getEntries.useSuspenseQuery({
		id: watchlistId,
	});
	const [selectedView, setSelectedView] = useState<"grid" | "list">(() => {
		if (typeof window !== "undefined") {
			const storedView = localStorage.getItem(SELECTED_VIEW_COOKIE_NAME);
			return storedView ? (storedView as "grid" | "list") : "grid";
		}
		return "grid";
	});

	return (
		<div className="pl-8 pr-14 border-b py-6">
			<div className="flex items-center w-full justify-between text-carbon-900">
				<div className="flex items-center gap-2">
					<ListOrderedIcon className="w-4 h-4" />
					<p className="font-mono text-xs">ENTRIES</p>
				</div>
				<ViewToggle
					selectedView={selectedView}
					setSelectedView={setSelectedView}
				/>
			</div>
			{selectedView === "grid" ? (
				<GridList entries={entries} watchlistId={watchlistId} />
			) : (
				<RowList entries={entries} watchlistId={watchlistId} />
			)}
		</div>
	);
}
