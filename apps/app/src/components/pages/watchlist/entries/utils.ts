import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { addMovieAction } from "~/actions/movies/add-movie";
import { addWatchlistEntryAction } from "~/actions/watchlist/add-watchlist-entry";
import { deleteWatchlistEntryAction } from "~/actions/watchlist/delete-watchlist-entry";
import { updateEntryOrderAction } from "~/actions/watchlist/update-entry-order";
import type { GetWatchlistEntriesReturnType } from "~/queries/watchlist/get-watchlist-entries";

export default function useEntryActions({
	localEntries,
	setLocalEntries,
	watchlistId,
	entries,
}: {
	entries: GetWatchlistEntriesReturnType;
	localEntries: GetWatchlistEntriesReturnType;
	setLocalEntries: React.Dispatch<
		React.SetStateAction<GetWatchlistEntriesReturnType>
	>;
	watchlistId: string;
}) {
	const updateEntryOrder = useAction(updateEntryOrderAction);

	const deleteEntry = useAction(deleteWatchlistEntryAction, {
		onExecute: async ({ input: entryToDelete }) => {
			setLocalEntries(
				localEntries?.filter((entry) => entry.id !== entryToDelete.entryId) ??
					[],
			);
		},
		onError: (err) => {
			setLocalEntries(entries);
			toast.error("Failed to delete entry. Please try again.");
		},
	});

	const addEntry = useAction(addWatchlistEntryAction, {
		onExecute: async ({ input: newEntry }) => {
			const contentExists = localEntries?.some(
				(entry) =>
					entry.contentId === newEntry.contentId &&
					entry.watchlistId === watchlistId,
			);

			if (contentExists) {
				toast.error("Movie already present in watchlist");
				return;
			}

			const optimisticEntry = {
				contentId: newEntry.contentId,
				order: localEntries?.length ?? 0,
				id: crypto.randomUUID(),
				userId: "optimistic-user-id",
				createdAt: new Date(),
				watchlistId: watchlistId,
				watched: [],
				movie: {
					contentId: newEntry.content.contentId,
					title: newEntry.content.title,
					overview: newEntry.content.overview ?? null,
					poster: newEntry.content.poster,
					backdrop: newEntry.content.backdrop,
					releaseDate: newEntry.content.releaseDate,
					id: crypto.randomUUID(),
					posterBlurhash: null,
					createdAt: new Date(),
					updatedAt: null,
				},
			};

			setLocalEntries([...(localEntries ?? []), optimisticEntry]);
		},
		onError: (err) => {
			setLocalEntries(entries);
			toast.error("Failed to add entry. Please try again.");
		},
	});

	const addMovie = useAction(addMovieAction);

	return {
		updateEntryOrder: updateEntryOrder.execute,
		deleteEntry: deleteEntry.execute,
		addEntry: addEntry.execute,
		addMovie: addMovie.execute,
	};
}
