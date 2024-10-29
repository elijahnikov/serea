import type { RouterOutputs } from "@serea/api";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function useEntryActions({
	localEntries,
	setLocalEntries,
	watchlistId,
	entries,
}: {
	entries: RouterOutputs["watchlist"]["getEntries"];
	localEntries: RouterOutputs["watchlist"]["getEntries"];
	setLocalEntries: React.Dispatch<
		React.SetStateAction<RouterOutputs["watchlist"]["getEntries"]>
	>;
	watchlistId: string;
}) {
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
					id: newEntry.id,
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
						id: newEntry.id,
						posterBlurhash: null,
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

	const { mutate: addMovie } = api.movie.add.useMutation();

	return {
		updateEntryOrder,
		deleteEntry,
		addEntry,
		addMovie,
	};
}
