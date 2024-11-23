import { api } from "~/trpc/react";

export default function useEntries() {
	const trpcUtils = api.useUtils();

	const addEntry = api.watchlist.addEntry.useMutation({
		onSuccess: () => {
			trpcUtils.watchlist.getEntries.invalidate();
		},
	});
	const deleteEntry = api.watchlist.deleteEntry.useMutation({
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
