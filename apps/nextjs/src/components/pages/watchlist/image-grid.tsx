import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import { Plus, PlusIcon } from "lucide-react";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";
import MovieDropdown from "./movie-dropdown";
import type { RouterOutputs } from "@serea/api";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { Button } from "@serea/ui/button";
import MovieSearch from "../create/movie-search";
import { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from "sonner";

export default function ImageGrid({
	entries,
	isOwner = false,
	watchlistId,
}: {
	entries: RouterOutputs["watchlist"]["getEntries"];
	isOwner?: boolean;
	watchlistId: string;
}) {
	if (!entries || entries.length === 0) {
		return (
			<div className="grid grid-cols-5 gap-x-4">
				<AddEntryButton watchlistId={watchlistId} />
			</div>
		);
	}

	return (
		<div className="grid grid-cols-5 gap-x-4">
			<TooltipProvider>
				{entries
					?.sort((a, b) => a.order - b.order)
					.map((entry) => (
						<div key={entry.id}>
							<TooltipRoot>
								<TooltipTrigger asChild>
									<div className="flex flex-col items-center">
										{isOwner ? (
											<MovieDropdown entry={entry} />
										) : (
											<Image
												className="rounded-md border-[0.5px] border-surface-200"
												width={0}
												height={0}
												placeholder="blur"
												sizes="100vw"
												style={{ width: "100%", height: "auto" }}
												alt={`Poster for ${entry.movie.title}`}
												src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
											/>
										)}
										<p className="font-medium text-neutral-500 text-sm">
											{entry.order + 1}
										</p>
									</div>
								</TooltipTrigger>
								<TooltipContent className="flex items-center space-x-1">
									<p className="font-medium">{entry.movie.title}</p>
									{entry.movie.releaseDate && (
										<p className="font-medium text-neutral-400">
											{new Date(entry.movie.releaseDate).getFullYear()}
										</p>
									)}
								</TooltipContent>
							</TooltipRoot>
						</div>
					))}
				<AddEntryButton watchlistId={watchlistId} />
			</TooltipProvider>
		</div>
	);
}

function AddEntryButton({ watchlistId }: { watchlistId: string }) {
	const [open, setOpen] = useState(false);

	const utils = api.useUtils();

	const { mutate: addMovie } = api.movie.add.useMutation();
	const { mutate: addEntry } = api.watchlist.addEntry.useMutation({
		onMutate: async (newEntry) => {
			await utils.watchlist.getEntries.cancel();
			const previousEntries = utils.watchlist.getEntries.getData({
				id: watchlistId,
			});

			const contentExists = previousEntries?.some(
				(entry) =>
					entry.contentId === newEntry.contentId &&
					entry.watchlistId === watchlistId,
			);

			if (contentExists) {
				return { previousEntries, contentExists };
			}

			utils.watchlist.getEntries.setData({ id: watchlistId }, (old) => {
				const currentEntries = old ?? [];
				return [
					...currentEntries,
					{
						contentId: newEntry.contentId,
						order: currentEntries.length + 1,
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
			});
			return { previousEntries };
		},
		onError: (err, newEntry, context) => {
			utils.watchlist.getEntries.setData(
				{ id: watchlistId },
				context?.previousEntries,
			);
			toast.error("Failed to add entry. Please try again.");
		},
		onSettled: () => {
			// Refetch after error or success to ensure we're up to date
			utils.watchlist.getEntries.invalidate({ id: watchlistId });
		},
	});

	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<div className="bg-surface-100 border w-full min-h-[150px] h-[calc(100%-20px)] rounded-md cursor-pointer flex flex-col justify-center items-center">
						<Plus />
					</div>
				</PopoverTrigger>

				<PopoverContent className="min-w-[400px]">
					<MovieSearch
						callback={async (movie) => {
							addMovie({
								...movie,
							});
							addEntry({
								contentId: movie.contentId,
								watchlistId: watchlistId,
								content: movie,
							});
							setOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
