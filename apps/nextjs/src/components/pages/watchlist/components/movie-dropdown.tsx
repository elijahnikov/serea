"use client";

import React from "react";
import Image from "next/image";

import { EyeIcon, UserCheckIcon, TrashIcon, Ellipsis } from "lucide-react";

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
import { Button } from "@serea/ui/button";

export default function MovieDropdown({
	entry,
	onDeleteEntry,
	onOpenChange,
}: {
	entry: NonNullable<RouterOutputs["watchlist"]["getEntries"]>[number];
	onDeleteEntry: (entryId: string) => void;
	onOpenChange: (isOpen: boolean) => void;
}) {
	return (
		<DropdownMenu onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button
					size={"xs-icon"}
					className="focus:outline-none focus:ring-0 bg-surface-50 h-6 w-6"
					variant={"outline"}
				>
					<Ellipsis size={14} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
						<EyeIcon size={16} />
						<span>Mark as watched</span>
					</DropdownMenuItem>

					<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
						onSelect={() => {
							onDeleteEntry(entry.id);
						}}
						destructive
					>
						<TrashIcon size={16} />
						<span>Delete from list</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
