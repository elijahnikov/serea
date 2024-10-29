import type { RouterOutputs } from "@serea/api";
import { useState } from "react";
import AddEntryButton from "./add-entry-button";
import { api } from "~/trpc/react";
import { TooltipProvider } from "@serea/ui/tooltip";
import SortableEntryRow from "./entry";
import useEntryActions from "../utils";
import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Skeleton } from "@serea/ui/skeleton";

export default function EntryRows({
	entries,
	role,
	watchlistId,
}: {
	entries: RouterOutputs["watchlist"]["getEntries"];
	role: "owner" | "editor" | "viewer" | "non-member";
	watchlistId: string;
}) {
	const [open, setOpen] = useState(false);
	const [localEntries, setLocalEntries] = useState(entries);

	const { updateEntryOrder, deleteEntry, addEntry, addMovie } = useEntryActions(
		{
			entries,
			localEntries,
			setLocalEntries,
			watchlistId,
		},
	);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor),
	);

	const handleDeleteEntry = (entryId: string) => {
		deleteEntry.mutate({ entryId, watchlistId });
	};

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (active.id !== over?.id) {
			const oldIndex = localEntries.findIndex(
				(entry) => entry.id === active.id,
			);
			const newIndex = localEntries.findIndex((entry) => entry.id === over?.id);

			const newEntries = arrayMove(localEntries, oldIndex, newIndex).map(
				(entry, index) => ({
					...entry,
					order: index,
				}),
			);
			setLocalEntries(newEntries);

			updateEntryOrder({
				watchlistId,
				entryId: active.id as string,
				newOrder: newIndex,
			});
		}
	};

	if ((!entries || entries.length === 0) && role === "owner") {
		return (
			<div className="grid grid-cols-5 gap-x-4">
				<AddEntryButton
					open={open}
					setOpen={setOpen}
					addEntry={addEntry}
					addMovie={addMovie}
					watchlistId={watchlistId}
				/>
			</div>
		);
	}

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<TooltipProvider>
				<SortableContext
					items={localEntries.map((entry) => entry.id)}
					strategy={verticalListSortingStrategy}
				>
					<div className="space-y-4">
						{(role === "owner" || role === "editor") && (
							<AddEntryButton
								open={open}
								setOpen={setOpen}
								addEntry={addEntry}
								addMovie={addMovie}
								watchlistId={watchlistId}
							/>
						)}
						{localEntries
							.sort((a, b) => a.order - b.order)
							.map((entry) => (
								<SortableEntryRow
									role={role}
									key={entry.id}
									entry={entry}
									isOwner={role === "owner"}
									onDeleteEntry={handleDeleteEntry}
								/>
							))}
					</div>
				</SortableContext>
			</TooltipProvider>
		</DndContext>
	);
}

export function EntryRowsSkeleton() {
	return (
		<div className="space-y-4">
			<div className="h-10 w-full">
				<Skeleton className="h-full w-full" />
			</div>

			{Array.from({ length: 3 }).map((_, index) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={index}
					className="flex items-center gap-2 bg-surface-50 border-surface-100 border rounded-md px-2 py-2"
				>
					<Skeleton className="h-4 w-4" />
					<Skeleton className="h-[76px] w-[52px]" />

					<div className="flex flex-1 flex-col gap-2">
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-4 w-24" />
						<div className="flex gap-1">
							<Skeleton className="h-4 w-4 rounded-full" />
							<Skeleton className="h-4 w-4 rounded-full" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
