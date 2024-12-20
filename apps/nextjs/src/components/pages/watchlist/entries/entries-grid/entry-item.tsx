"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui/cn";
import { TooltipContent, TooltipRoot, TooltipTrigger } from "@serea/ui/tooltip";
import Image from "next/image";
import { useState } from "react";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";
import MovieDropdown from "../../movie-dropdown";

export default function SortableEntryItem({
	entry,
	isOwner,
	onDeleteEntry,
	role,
}: {
	entry: RouterOutputs["watchlist"]["getEntries"][number];
	isOwner: boolean;
	onDeleteEntry: (entryId: string) => void;
	role: "owner" | "editor" | "viewer" | "non-member";
}) {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: entry.id,
		disabled: isDropdownOpen || role === "viewer",
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...(role === "viewer" ? {} : attributes)}
			{...(isDropdownOpen ? {} : listeners)}
		>
			<EntryItem
				role={role}
				onDeleteEntry={onDeleteEntry}
				isDragging={isDragging}
				entry={entry}
				isOwner={isOwner}
				isDropdownOpen={isDropdownOpen}
				setIsDropdownOpen={setIsDropdownOpen}
			/>
		</div>
	);
}

function EntryItem({
	entry,
	isOwner,
	isDragging = false,
	onDeleteEntry,
	isDropdownOpen,
	setIsDropdownOpen,
	role,
}: {
	entry: RouterOutputs["watchlist"]["getEntries"][number];
	isOwner: boolean;
	isDragging?: boolean;
	onDeleteEntry: (entryId: string) => void;
	isDropdownOpen: boolean;
	setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
	role: "owner" | "editor" | "viewer" | "non-member";
}) {
	return (
		<TooltipRoot>
			<TooltipTrigger asChild disabled={isDragging}>
				<div className="flex flex-col items-center">
					<div className="relative group">
						{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
						<div
							className={`absolute top-2 right-2 z-40 transition-opacity duration-200 ${
								isDropdownOpen
									? "opacity-100"
									: "opacity-0 group-hover:opacity-100"
							}`}
							onClick={(e) => e.stopPropagation()}
						>
							<MovieDropdown
								isOpen={isDropdownOpen}
								role={role}
								entry={entry}
								onDeleteEntry={onDeleteEntry}
								onOpenChange={setIsDropdownOpen}
							/>
						</div>
						<div className={isDropdownOpen ? "pointer-events-none" : ""}>
							{entry.movie.posterBlurHash !== null ? (
								<Image
									className={cn("rounded-md border-[0.5px] border-surface-200")}
									width={0}
									height={0}
									sizes="100vw"
									placeholder="blur"
									blurDataURL={entry.movie.posterBlurHash}
									style={{ width: "100%", height: "auto" }}
									alt={`Poster for ${entry.movie.title}`}
									src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
								/>
							) : (
								<Image
									className={cn("rounded-md border-[0.5px] border-surface-200")}
									width={0}
									height={0}
									sizes="100vw"
									style={{ width: "100%", height: "auto" }}
									alt={`Poster for ${entry.movie.title}`}
									src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
								/>
							)}
						</div>
					</div>
					<p className="font-medium text-neutral-500 text-sm">
						{entry.order + 1}
					</p>
				</div>
			</TooltipTrigger>
			{!isDragging && (
				<TooltipContent className="flex items-center space-x-1">
					<p className="font-medium">{entry.movie.title}</p>
					{entry.movie.releaseDate && (
						<p className="font-medium dark:text-neutral-600 text-neutral-400">
							{new Date(entry.movie.releaseDate).getFullYear()}
						</p>
					)}
				</TooltipContent>
			)}
		</TooltipRoot>
	);
}
