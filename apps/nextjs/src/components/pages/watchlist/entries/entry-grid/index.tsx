import { TooltipProvider } from "@serea/ui/tooltip";
import type { RouterOutputs } from "@serea/api";

import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";
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
	rectSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";
import SortableEntryItem from "./entry";
import AddEntryButton from "./add-entry-button";
import { nanoid } from "nanoid";
import useEntryActions from "../utils";

export default function EntryGrid({
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
					items={localEntries.map((e) => e.id)}
					strategy={rectSortingStrategy}
				>
					<div className="grid grid-cols-5 gap-x-4">
						{localEntries
							?.sort((a, b) => a.order - b.order)
							.map((entry) => (
								<SortableEntryItem
									role={role}
									key={entry.id}
									entry={entry}
									isOwner={role === "owner"}
									onDeleteEntry={handleDeleteEntry}
								/>
							))}
						{(role === "owner" || role === "editor") && (
							<AddEntryButton
								open={open}
								setOpen={setOpen}
								addEntry={addEntry}
								addMovie={addMovie}
								watchlistId={watchlistId}
							/>
						)}
					</div>
				</SortableContext>
			</TooltipProvider>
		</DndContext>
	);
}
