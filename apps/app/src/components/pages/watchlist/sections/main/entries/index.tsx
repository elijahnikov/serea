"use client";

import { Button } from "@serea/ui/button";
import { ListOrderedIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { SELECTED_VIEW_COOKIE_NAME } from "~/lib/constants";
import { api } from "~/trpc/react";
import AddEntry from "./add-entry";
import GridList from "./grid-list";
import LoadingEntries from "./loading";
import RowList from "./row-list";
import ViewToggle from "./view-toggle";

export default function EntriesSection({
	watchlistId,
	isOwner,
}: {
	watchlistId: string;
	isOwner: boolean;
}) {
	const { data, hasNextPage, fetchNextPage, isLoading } =
		api.watchlist.getEntries.useInfiniteQuery(
			{
				watchlistId,
				limit: 60,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextCursor,
			},
		);
	const entries = data?.pages.flatMap((page) => page.entries) ?? [];

	const [selectedView, setSelectedView] = useState<"grid" | "list">(() => {
		if (typeof window !== "undefined") {
			const storedView = localStorage.getItem(SELECTED_VIEW_COOKIE_NAME);
			return storedView ? (storedView as "grid" | "list") : "grid";
		}
		return "grid";
	});

	if (isLoading) {
		return <LoadingEntries />;
	}

	return (
		<div className="pl-8 pr-14 border-b py-6">
			<div className="flex items-center w-full justify-between text-carbon-900">
				<div className="flex items-center gap-2">
					<ListOrderedIcon className="w-4 h-4" />
					<p className="font-mono text-xs">ENTRIES</p>
				</div>
				<div className="flex items-center gap-2">
					<div id="add-entry-portal" />
					<ViewToggle
						selectedView={selectedView}
						setSelectedView={setSelectedView}
					/>
				</div>
			</div>
			{selectedView === "grid" ? (
				<GridList
					isOwner={isOwner}
					entries={entries}
					watchlistId={watchlistId}
				/>
			) : (
				<RowList
					isOwner={isOwner}
					entries={entries}
					watchlistId={watchlistId}
				/>
			)}
			<div className="w-full flex justify-center">
				{hasNextPage && (
					<Button
						after={<PlusIcon />}
						variant={"outline"}
						onClick={() => fetchNextPage()}
					>
						Load more
					</Button>
				)}
			</div>
		</div>
	);
}
