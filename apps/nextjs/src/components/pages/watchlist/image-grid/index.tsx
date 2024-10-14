import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import { Plus } from "lucide-react";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";
import type { RouterInputs, RouterOutputs } from "@serea/api";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";

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
	useSortable,
} from "@dnd-kit/sortable";
import SortableEntryItem from "./entry";
import MovieSearch from "../../create/movie-search";
import AddEntryButton from "./add-entry-button";

export default function ImageGrid({
	entries,
	isOwner = false,
	watchlistId,
}: {
	entries: RouterOutputs["watchlist"]["getEntries"];
	isOwner?: boolean;
	watchlistId: string;
}) {
	const [open, setOpen] = useState(false);
	const [localEntries, setLocalEntries] = useState(entries);

	const utils = api.useUtils();

	const { mutate: updateEntryOrder } =
		api.watchlist.updateEntryOrder.useMutation({
			onMutate: async ({ entryId, newOrder }) => {
				await utils.watchlist.getEntries.cancel({ id: watchlistId });
				const previousEntries = utils.watchlist.getEntries.getData({
					id: watchlistId,
				});

				utils.watchlist.getEntries.setData({ id: watchlistId }, (old) => {
					if (!old) return old;
					const updatedEntries = [...old];
					const movedEntryIndex = updatedEntries.findIndex(
						(e) => e.id === entryId,
					);
					if (movedEntryIndex === -1) return old;

					const [movedEntry] = updatedEntries.splice(movedEntryIndex, 1);
					movedEntry && updatedEntries.splice(newOrder, 0, movedEntry);

					return updatedEntries.map((entry, index) => ({
						...entry,
						order: index,
					}));
				});

				return { previousEntries };
			},
			onError: (err, newEntry, context) => {
				// If the mutation fails, use the context returned from onMutate to roll back
				utils.watchlist.getEntries.setData(
					{ id: watchlistId },
					context?.previousEntries,
				);
				setLocalEntries(context?.previousEntries || entries);
				toast.error("Failed to update entry order. Please try again.");
			},
			onSettled: () => {
				// Sync with the server once mutation has settled
				utils.watchlist.getEntries.invalidate({ id: watchlistId });
			},
		});

	const deleteEntry = api.watchlist.deleteEntry.useMutation({
		onMutate: async (variables) => {
			await utils.watchlist.getEntries.cancel();
			const previousEntries = utils.watchlist.getEntries.getData({
				id: variables.watchlistId,
			});

			const updatedEntries = localEntries
				.filter((e) => e.id !== variables.entryId)
				.map((e, index) => ({ ...e, order: index }));

			setLocalEntries(updatedEntries);

			utils.watchlist.getEntries.setData(
				{ id: variables.watchlistId },
				updatedEntries,
			);

			return { previousEntries };
		},
		onError: (_, variables, context) => {
			if (context?.previousEntries) {
				utils.watchlist.getEntries.setData(
					{ id: variables.watchlistId },
					context.previousEntries,
				);
				setLocalEntries(context.previousEntries);
			}
			toast.error("Failed to delete entry. Please try again.");
		},
		onSettled: () => {
			utils.watchlist.getEntries.invalidate({ id: watchlistId });
		},
	});
	const { mutate: addMovie } = api.movie.add.useMutation();
	const { mutate: addEntry } = api.watchlist.addEntry.useMutation({
		onMutate: async (newEntry) => {
			await utils.watchlist.getEntries.cancel();
			const previousEntries = utils.watchlist.getEntries.getData({
				id: watchlistId,
			});

			const contentExists = localEntries.some(
				(entry) =>
					entry.contentId === newEntry.contentId &&
					entry.watchlistId === watchlistId,
			);

			if (contentExists) {
				toast.error("Movie already present in watchlist");
				return { previousEntries, contentExists };
			}

			const updatedEntries = [
				...localEntries,
				{
					contentId: newEntry.contentId,
					order: localEntries.length,
					id: `temp-id-${Date.now()}`,
					userId: "optimistic-user-id",
					createdAt: new Date(),
					watchlistId: watchlistId,
					movie: {
						contentId: newEntry.content.contentId,
						title: newEntry.content.title,
						overview: newEntry.content.overview ?? null,
						poster: newEntry.content.poster,
						backdrop: newEntry.content.backdrop,
						releaseDate: newEntry.content.releaseDate,
						id: `temp-id-${Date.now()}`,
						createdAt: new Date(),
						updatedAt: null,
					},
				},
			];

			setLocalEntries(updatedEntries);

			utils.watchlist.getEntries.setData({ id: watchlistId }, updatedEntries);
			return { previousEntries };
		},
		onError: (err, newEntry, context) => {
			utils.watchlist.getEntries.setData(
				{ id: watchlistId },
				context?.previousEntries,
			);
			setLocalEntries(context?.previousEntries || entries);
			toast.error("Failed to add entry. Please try again.");
		},
		onSettled: () => {
			utils.watchlist.getEntries.invalidate({ id: watchlistId });
		},
	});

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

	if ((!entries || entries.length === 0) && isOwner) {
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
									key={entry.id}
									entry={entry}
									isOwner={isOwner}
									onDeleteEntry={handleDeleteEntry}
								/>
							))}
						{isOwner && (
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
