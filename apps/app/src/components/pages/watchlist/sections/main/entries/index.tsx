"use client";

import { Button } from "@serea/ui/button";
import { ListOrderedIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import {
	SELECTED_VIEW_COOKIE_NAME,
	TMDB_IMAGE_BASE_URL_HD,
} from "~/lib/constants";
import { api } from "~/trpc/react";
import AddEntry from "./add-entry";
import GridList from "./grid-list";
import LoadingEntries from "./loading";
import RowList from "./row-list";
import ViewToggle from "./view-toggle";

export default function EntriesSection({
	watchlistId,
	isOwner,
	isEditor,
}: {
	watchlistId: string;
	isOwner: boolean;
	isEditor: boolean;
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
		<div className="pl-8 pr-8 border-b py-6">
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
			{(!entries || entries.length === 0) && (
				<div className="flex flex-col w-full items-center justify-center h-full">
					<div className="flex flex-col items-center justify-center h-full">
						<p className="dark:text-white text-carbon-900 text-sm font-medium">
							{isOwner
								? "You haven't added any entries yet."
								: "No entries added yet."}
						</p>
						{isOwner && (
							<div className="text-carbon-900 text-sm flex">
								Use the <PlusIcon className="mx-1" size={18} /> button to add an
								entry.
							</div>
						)}
					</div>
					<div className="grid mb-8 w-full grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-2">
						{Array.from({ length: 6 }).map((_, index) => (
							<div key={index} className="relative w-full aspect-[2/3]">
								<div className="w-full h-full dark:bg-carbon-dark-300 border rounded-md" />
							</div>
						))}
					</div>
				</div>
			)}
			{selectedView === "grid" ? (
				<GridList
					isOwner={isOwner}
					isEditor={isEditor}
					entries={entries}
					watchlistId={watchlistId}
				/>
			) : (
				<RowList
					isOwner={isOwner}
					isEditor={isEditor}
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
