import { api } from "~/trpc/react";
import { toast } from "sonner";
import type { RouterOutputs } from "@serea/api";

type Entry = RouterOutputs["watchlist"]["getEntries"][number];

export default function useEntries({
	entries,
	localEntries,
	setLocalEntries,
}: {
	entries: Entry[];
	localEntries: Entry[];
	setLocalEntries: (entries: Entry[]) => void;
}) {
	const trpcUtils = api.useUtils();

	const addEntry = api.watchlist.addEntry.useMutation({
		onMutate: async (input) => {
			const tempEntry: Entry = {
				contentId: input.contentId,
				order: localEntries.length,
				id: crypto.randomUUID(),
				userId: "optimistic-user-id",
				createdAt: new Date(),
				updatedAt: null,
				watchlistId: input.watchlistId,
				watched: [],
				movie: {
					contentId: input.contentId,
					title: input.content.title,
					overview: input.content.overview ?? null,
					poster: input.content.poster,
					backdrop: input.content.backdrop,
					releaseDate: input.content.releaseDate,
					id: crypto.randomUUID(),
					posterBlurHash: null,
					createdAt: new Date(),
					updatedAt: null,
				},
			};

			setLocalEntries([...localEntries, tempEntry]);
		},
		onError: (err) => {
			setLocalEntries(entries);
			toast.error("Failed to add entry. Please try again.");
		},
		onSuccess: () => {
			trpcUtils.watchlist.getEntries.invalidate();
		},
	});
	const deleteEntry = api.watchlist.deleteEntry.useMutation({
		onMutate: async ({ entryId }) => {
			setLocalEntries(
				localEntries?.filter((entry) => entry.id !== entryId) ?? [],
			);
		},
		onError: (err) => {
			setLocalEntries(entries);
			toast.error("Failed to delete entry. Please try again.");
		},
		onSuccess: () => {
			trpcUtils.watchlist.getEntries.invalidate();
		},
	});
	const addMovie = api.movie.addMovie.useMutation();
	const updateEntryOrder = api.watchlist.updateEntryOrder.useMutation();

	return {
		addEntry,
		deleteEntry,
		addMovie,
		updateEntryOrder,
	};
}
