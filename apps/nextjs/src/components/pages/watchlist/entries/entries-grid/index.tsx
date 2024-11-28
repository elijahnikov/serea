"use client";

import {
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	rectSortingStrategy,
} from "@dnd-kit/sortable";
import type { RouterOutputs } from "@serea/api";
import { TooltipProvider } from "@serea/ui/tooltip";
import { useEffect, useState } from "react";
import useEntries from "../utils";
import AddEntryButton from "./add-entry-button";
import SortableEntryItem from "./entry-item";

export default function EntriesGrid({
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

	const { addEntry, deleteEntry, addMovie, updateEntryOrder } = useEntries({
		entries,
		localEntries,
		setLocalEntries,
	});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (!localEntries) return;
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

			updateEntryOrder.mutate({
				watchlistId,
				entryId: active.id as string,
				newOrder: newIndex,
			});
		}
	};

	const handleDeleteEntry = (entryId: string) => {
		deleteEntry.mutate({ watchlistId, entryId });
	};

	useEffect(() => {
		setLocalEntries(entries);
	}, [entries]);

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
								addEntry={addEntry.mutate}
								addMovie={addMovie.mutate}
								watchlistId={watchlistId}
							/>
						)}
					</div>
				</SortableContext>
			</TooltipProvider>
		</DndContext>
	);
}
