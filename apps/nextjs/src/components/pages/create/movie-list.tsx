import { Button } from "@serea/ui/button";
import Label from "@serea/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import type { UseFormReturn } from "react-hook-form";

import { TMDB_IMAGE_BASE_URL_SD } from "~/lib/constants";
import {
	DndContext,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, X } from "lucide-react";
import { useState } from "react";
import type { CreateWatchlist, MovieTableData } from "@serea/validators";
import { api } from "~/trpc/react";
import MovieSearch from "./movie-search";

export default function MovieList({
	form,
}: { form: UseFormReturn<CreateWatchlist> }) {
	const [open, setOpen] = useState<boolean>(false);

	const { mutate: createMovie } = api.movie.addMovie.useMutation();

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const entries = form.watch("entries");

	const addEntry = (newEntry: Omit<MovieTableData, "order">) => {
		createMovie({
			...newEntry,
		});
		const currentEntries = form.getValues("entries");
		if (
			currentEntries.findIndex(
				(entry) => entry.contentId === newEntry.contentId,
			) === -1
		) {
			const entryWithOrder = {
				...newEntry,
				order: currentEntries.length,
			};
			form.setValue("entries", [...currentEntries, entryWithOrder]);
		}
	};

	const removeEntry = (indexToRemove: number) => {
		const currentEntries = form.getValues("entries");
		const updatedEntries = currentEntries
			.filter((_, index) => index !== indexToRemove)
			.map((entry, index) => ({ ...entry, order: index }));
		form.setValue("entries", updatedEntries);
	};

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (active.id !== over.id) {
			const oldIndex = entries.findIndex(
				(entry) => entry.contentId === active.id,
			);
			const newIndex = entries.findIndex(
				(entry) => entry.contentId === over.id,
			);
			const newEntries = [...entries];
			const [reorderedItem] = newEntries.splice(oldIndex, 1);
			if (reorderedItem) newEntries.splice(newIndex, 0, reorderedItem);
			const updatedEntries = newEntries.map((entry, index) => ({
				...entry,
				order: index,
			}));
			form.setValue("entries", updatedEntries);
		}
	};

	return (
		<div className="w-full">
			<div className="w-full">
				<div>
					<Label className="mb-2">Movies</Label>
					<div className="bg-white dark:bg-transparent border border-dashed border-surface-200 shadow-wg-xs flex flex-col items-center px-4 w-full max-h-[600px] min-h-[600px] rounded-lg">
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<Button
									variant="outline"
									className="mt-4"
									size="sm"
									before={<Plus size={14} />}
								>
									Add movie
								</Button>
							</PopoverTrigger>

							<PopoverContent className="min-w-[400px]">
								<MovieSearch
									callback={(movie) => {
										addEntry(movie);
										setOpen(false);
									}}
								/>
							</PopoverContent>
						</Popover>
						<div className="space-y-2 pb-4 mt-4 max-h-[600px] overflow-y-auto w-full">
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={entries.map((entry) => entry.contentId)}
									strategy={verticalListSortingStrategy}
								>
									{entries?.length > 0 &&
										entries.map((entry, index) => (
											<MovieCard
												index={index}
												removeEntry={removeEntry}
												movie={entry}
												key={entry.contentId}
											/>
										))}
								</SortableContext>
							</DndContext>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function MovieCard({
	movie,
	index,
	removeEntry,
}: {
	movie: MovieTableData;
	index: number;
	removeEntry: (index: number) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: movie.contentId });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex space-x-2 relative bg-white dark:bg-surface dark:border-surface-100 p-1 w-full rounded-lg border"
		>
			<div className="min-h-full flex items-center justify-center ml-1">
				<div
					{...attributes}
					{...listeners}
					// className="bg-neutral-100 p-1 rounded-md border cursor-grabbing"
				>
					<Button
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
						}}
						className="pointer-events-none h-6 w-6"
						size={"xs-icon"}
						variant={"outline"}
					>
						<GripVertical size={14} className="text-neutral-500" />
					</Button>
				</div>
			</div>
			<div>
				{movie.poster ? (
					<img
						className="aspect-auto rounded-md"
						src={`${TMDB_IMAGE_BASE_URL_SD}${movie.poster}`}
						alt={`Poster for ${movie.title}`}
						width={40}
						height={80}
					/>
				) : (
					<div className="w-full min-h-[110px] flex-col max-w-[70px] text-center h-full justify-center flex items-center">
						<p className="text-wrap text-xs font-medium text-neutral-600">
							{movie.title}
						</p>
						<p className="text-wrap text-xs font-medium dark:text-neutral-400 text-neutral-500">
							{new Date(movie.releaseDate).getFullYear()}
						</p>
					</div>
				)}
			</div>
			<div>
				<p className="font-medium truncate text-md max-w-[300px]">
					{movie.title}
				</p>
				<p className="font-medium text-sm dark:text-neutral-400 text-neutral-500">
					{new Date(movie.releaseDate).getFullYear()}
				</p>
			</div>
			<Button
				onClick={() => removeEntry(index)}
				className="absolute top-[50%] -translate-y-1/2 right-2 h-6 w-6"
				size={"xs-icon"}
				variant={"outline"}
			>
				<X size={14} className="text-neutral-500" />
			</Button>
		</div>
	);
}
