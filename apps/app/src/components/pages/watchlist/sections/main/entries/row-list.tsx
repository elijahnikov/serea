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
import { AvatarGroup, AvatarGroupItem } from "@serea/ui/avatar-group";
import { CheckCheckIcon } from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { createPortal } from "react-dom";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";
import { api } from "~/trpc/react";
import AddEntry from "./add-entry";
import MovieDropdown from "./movie-dropdown";

export default function RowList({
	entries,
	watchlistId,
	isOwner,
	isEditor,
}: {
	entries: RouterOutputs["watchlist"]["getEntries"]["entries"];
	watchlistId: string;
	isOwner: boolean;
	isEditor: boolean;
}) {
	const id = React.useId();

	const [localEntries, setLocalEntries] =
		React.useState<RouterOutputs["watchlist"]["getEntries"]["entries"]>(
			entries,
		);

	const utils = api.useUtils();
	const updateEntryOrder = api.watchlist.updateEntryOrder.useMutation();
	const addEntry = api.watchlist.addEntry.useMutation({
		onMutate: async (newEntry) => {
			if (localEntries.length >= 60) return;
			const optimisticEntry: RouterOutputs["watchlist"]["getEntries"]["entries"][number] =
				{
					id: `temp-${Date.now()}`,
					order: localEntries.length,
					watchlistId,
					contentId: newEntry.contentId,
					userId: "",
					event: [],
					createdAt: new Date(),
					updatedAt: new Date(),
					movie: {
						genres: [],
						budget: 0,
						revenue: 0,
						imdbId: null,
						runtime: 0,
						id: `temp-movie-${Date.now()}`,
						contentId: newEntry.contentId,
						title: newEntry.content.title,
						overview: newEntry.content.overview ?? null,
						poster: newEntry.content.poster,
						backdrop: newEntry.content.backdrop,
						releaseDate: newEntry.content.releaseDate,
						createdAt: new Date(),
						updatedAt: new Date(),
					},
					_count: {
						watched: 0,
					},
					watched: [],
				};

			setLocalEntries((prev) => [...prev, optimisticEntry]);
		},
		onError: () => {
			setLocalEntries(entries);
		},
		onSuccess: () => {
			utils.watchlist.getEntries.invalidate({ watchlistId });
		},
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

	React.useEffect(() => {
		setLocalEntries(entries);
	}, [entries]);

	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<DndContext
			id={id}
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
		>
			<SortableContext
				disabled={!isOwner}
				items={localEntries
					.sort((a, b) => a.order - b.order)
					.map((entry) => entry.id)}
			>
				<div className="flex flex-col gap-4 mt-4">
					{localEntries
						.sort((a, b) => a.order - b.order)
						.map((entry) => (
							<SortableEntry
								role={isOwner ? "OWNER" : isEditor ? "EDITOR" : "VIEWER"}
								key={entry.id}
								entry={entry}
							/>
						))}
				</div>
				{isOwner &&
					mounted &&
					createPortal(
						<AddEntry addEntry={addEntry.mutate} watchlistId={watchlistId} />,
						document.getElementById("add-entry-portal") ?? document.body,
					)}
			</SortableContext>
		</DndContext>
	);
}

function SortableEntry({
	entry,
	role,
}: {
	entry: RouterOutputs["watchlist"]["getEntries"]["entries"][number];
	role: "VIEWER" | "EDITOR" | "OWNER";
}) {
	const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({
			id: entry.id,
			disabled: isDropdownOpen,
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
			className="w-full group relative dark:bg-carbon-dark-100 bg-carbon-100 px-4 py-2 flex items-center gap-4 border rounded-md"
		>
			<div
				className={`absolute top-2 right-2 z-40 transition-opacity duration-200 ${
					isDropdownOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				}`}
			>
				<MovieDropdown
					role={role}
					entry={entry}
					isOpen={isDropdownOpen}
					onOpenChange={setIsDropdownOpen}
				/>
			</div>
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
					<p className="font-medium text-lg">{entry.movie.title} </p>
					<p className="font-normal text-sm dark:text-carbon-900/75 text-carbon-dark-500">
						{entry.movie.releaseDate &&
							new Date(entry.movie.releaseDate).getFullYear()}
					</p>
					<span>
						{entry.watched.length > 0 ? (
							<div className="flex mt-1 items-center gap-2">
								<CheckCheckIcon className="text-green-500" size={16} />
								<AvatarGroup
									moreLabel={
										entry.watched.length > 20
											? `+${entry.watched.length - 20}`
											: undefined
									}
									size="xs"
								>
									{entry.watched.slice(0, 20).map((watched) => (
										<AvatarGroupItem
											key={watched.id}
											src={watched.user.image ?? undefined}
											initials={watched.user.name ?? undefined}
										/>
									))}
								</AvatarGroup>
							</div>
						) : null}
					</span>
				</div>
			</div>
		</div>
	);
}
