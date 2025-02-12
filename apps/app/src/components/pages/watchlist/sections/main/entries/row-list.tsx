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
import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { RouterOutputs } from "@serea/api";
import Image from "next/image";
import * as React from "react";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";
import { api } from "~/trpc/react";

export default function RowList({
	entries,
	watchlistId,
}: {
	entries: RouterOutputs["watchlist"]["getEntries"];
	watchlistId: string;
}) {
	const id = React.useId();

	const updateEntryOrder = api.watchlist.updateEntryOrder.useMutation();

	const [localEntries, setLocalEntries] = React.useState(entries);

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

	React.useEffect(() => {
		setLocalEntries(entries);
	}, [entries]);

	return (
		<DndContext
			id={id}
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				items={localEntries
					.sort((a, b) => a.order - b.order)
					.map((entry) => entry.id)}
			>
				<div className="flex flex-col gap-4 mt-4">
					{localEntries
						.sort((a, b) => a.order - b.order)
						.map((entry) => (
							<SortableEntry key={entry.id} entry={entry} />
						))}
				</div>
			</SortableContext>
		</DndContext>
	);
}

function SortableEntry({
	entry,
}: { entry: RouterOutputs["watchlist"]["getEntries"][number] }) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: entry.id,
		});
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};
	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			suppressHydrationWarning
			className="w-full dark:bg-carbon-dark-100 bg-carbon-100 px-4 py-2 flex items-center gap-4 border rounded-md"
		>
			<div>
				<p className="font-mono text-sm font-medium dark:text-carbon-900/75 text-carbon-dark-500/50">
					{entry.order + 1}
				</p>
			</div>
			<div className="flex gap-4">
				<Image
					className="rounded-md border-[0.5px] border-surface-200"
					width={52}
					height={78}
					alt={`Poster for ${entry.movie.title}`}
					src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
				/>
				<div>
					<p className="font-medium text-md">{entry.movie.title} </p>
					<p className="font-normal text-sm dark:text-carbon-900/75 text-carbon-dark-500">
						{entry.movie.releaseDate &&
							new Date(entry.movie.releaseDate).getFullYear()}
					</p>
				</div>
			</div>
		</div>
	);
}
