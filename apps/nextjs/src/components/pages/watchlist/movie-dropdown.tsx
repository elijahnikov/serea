"use client";

import React from "react";
import Image from "next/image";

import { EyeIcon, UserCheckIcon, TrashIcon } from "lucide-react";

import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";
import type { RouterOutputs } from "@serea/api";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";
import AvatarGroup from "@serea/ui/avatar-group";
import { api } from "~/trpc/react";

export default function MovieDropdown({
	entry,
}: {
	entry: NonNullable<RouterOutputs["watchlist"]["getEntries"]>[number];
}) {
	const utils = api.useUtils();
	const deleteEntry = api.watchlist.deleteEntry.useMutation({
		onMutate: async (variables) => {
			await utils.watchlist.getEntries.cancel();
			const previousEntries = utils.watchlist.getEntries.getData({
				id: variables.watchlistId,
			});
			utils.watchlist.getEntries.setData(
				{ id: variables.watchlistId },
				(old) => {
					if (!old) return old;

					const entryIndex = old.findIndex(
						(entry) => entry.id === variables.entryId,
					);
					if (entryIndex === -1) return old;

					const deletedEntry = old[entryIndex];
					if (!deletedEntry) return old;

					const deletedOrder = deletedEntry.order;

					return old
						.filter((entry) => entry.id !== variables.entryId)
						.map((entry) => {
							if (entry.order > deletedOrder) {
								return { ...entry, order: entry.order - 1 };
							}
							return entry;
						});
				},
			);

			return { previousEntries };
		},
		onError: (err, variables, context) => {
			if (context?.previousEntries) {
				utils.watchlist.getEntries.setData(
					{ id: variables.watchlistId },
					context.previousEntries,
				);
			}
		},
	});

	return (
		<div className="relative group">
			<DropdownMenu>
				<DropdownMenuTrigger className="cursor-pointer" asChild>
					<div className="relative">
						<Image
							className="rounded-md border-[0.5px] border-surface-200"
							width={0}
							height={0}
							sizes="100vw"
							style={{ width: "100%", height: "auto" }}
							alt={`Poster for ${entry.movie.title}`}
							src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
						/>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="center" className="group/movie">
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<EyeIcon size={16} />
							<span>Mark as watched</span>
						</DropdownMenuItem>

						<DropdownMenuItem>
							<UserCheckIcon size={16} />
							<span>Mark as watched for all</span>
							<AvatarGroup
								size="xs"
								items={[
									{
										src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&auto=format&fit=crop&crop=face",
										alt: "Avatar 1",
									},
									{
										src: "https://images.unsplash.com/photo-1579613832107-64359da23b0c?w=250&h=250&auto=format&fit=crop&crop=face",
										alt: "Avatar 2",
									},
								]}
								moreLabel="+9"
							/>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuItem
							onClick={() =>
								deleteEntry.mutate({
									entryId: entry.id,
									watchlistId: entry.watchlistId,
								})
							}
							destructive
						>
							<TrashIcon size={16} />
							<span>Delete from list</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
