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
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import Image from "next/image";
import * as React from "react";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";
import { api } from "~/trpc/react";
import AddEntry from "./add-entry";

export default function GridList({
	entries,
	watchlistId,
	isOwner,
}: {
	entries: RouterOutputs["watchlist"]["getEntries"];
	watchlistId: string;
	isOwner: boolean;
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
			<TooltipProvider>
				<SortableContext
					items={localEntries
						.sort((a, b) => a.order - b.order)
						.map((entry) => entry.id)}
				>
					<div className="grid mt-4 grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2">
						{localEntries
							.sort((a, b) => a.order - b.order)
							.map((entry) => (
								<SortableEntry key={entry.id} entry={entry} />
							))}
						{isOwner && <AddEntry />}
					</div>
				</SortableContext>
			</TooltipProvider>
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
		<div ref={setNodeRef} style={style} {...attributes} {...listeners}>
			<div>
				<Tooltip>
					<TooltipTrigger asChild>
						<div className="flex flex-col items-center">
							<div className="relative group">
								<div>
									<Image
										className="rounded-md border-[0.5px] border-surface-200"
										width={0}
										height={0}
										sizes="100vw"
										style={{ width: "100%", height: "auto" }}
										alt={`Poster for ${entry.movie.title}`}
										src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
									/>
								</div>
							</div>
							<p className="font-medium text-neutral-500 text-sm">
								{entry.order + 1}
							</p>
						</div>
					</TooltipTrigger>
					<TooltipContent className="flex items-center space-x-1">
						<p className="font-medium">{entry.movie.title}</p>
						{entry.movie.releaseDate && (
							<p className="font-medium dark:text-neutral-600 text-neutral-400">
								{new Date(entry.movie.releaseDate).getFullYear()}
							</p>
						)}
					</TooltipContent>
				</Tooltip>
			</div>
		</div>
	);
}
