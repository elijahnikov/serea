import type { RouterOutputs } from "@serea/api";
import { TooltipRoot, TooltipTrigger } from "@serea/ui/tooltip";
import { useState } from "react";
import Image from "next/image";
import { cn } from "@serea/ui";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";
import moment from "moment";
import MovieDropdown from "../../components/movie-dropdown";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableEntryRow({
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
			{...(isDropdownOpen ? {} : listeners)}
		>
			<EntryRow
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

function EntryRow({
	entry,
	isDragging,
	isDropdownOpen,
	setIsDropdownOpen,
	role,
	onDeleteEntry,
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
				<div className="group bg-surface-50 border-surface-100 flex border rounded-md p-2 items-center relative">
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
							role={role}
							entry={entry}
							onDeleteEntry={onDeleteEntry}
							onOpenChange={setIsDropdownOpen}
						/>
					</div>
					<p className="mr-2 font-medium text-neutral-500 text-sm">
						{entry.order + 1}
					</p>
					<div className="min-h-[52px]">
						{entry.movie.posterBlurhash ? (
							<Image
								className={cn(
									"rounded-sm aspect-auto border-[0.5px] border-surface-200",
								)}
								width={52}
								height={52}
								placeholder="blur"
								// biome-ignore lint/style/noNonNullAssertion: <explanation>
								blurDataURL={entry.movie.posterBlurhash!}
								alt={`Poster for ${entry.movie.title}`}
								src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
							/>
						) : (
							<Image
								className={cn(
									"rounded-sm aspect-auto border-[0.5px] border-surface-200",
								)}
								width={52}
								height={52}
								alt={`Poster for ${entry.movie.title}`}
								src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
							/>
						)}
					</div>
					<div className="flex ml-4 flex-col">
						<div className="flex flex-col">
							<h1 className="text-md font-semibold">{entry.movie.title}</h1>
							{entry.movie.releaseDate && (
								<p className="leading-none text-neutral-500 font-medium text-xs">
									{moment(entry.movie.releaseDate).year()}
								</p>
							)}
						</div>
					</div>
				</div>
			</TooltipTrigger>
		</TooltipRoot>
	);
}
