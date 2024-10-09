"use client";

import React from "react";
import Image from "next/image";

import {
	PinIcon,
	DownloadIcon,
	EyeIcon,
	UsersIcon,
	UserCheckIcon,
	TrashIcon,
	Check,
	Tv,
} from "lucide-react";

import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";
import type { RouterOutputs } from "@serea/api";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";
import AvatarGroup from "@serea/ui/avatar-group";
import { AvatarWedges } from "@serea/ui/avatar";

export default function MovieDropdown({
	entry,
}: {
	entry: NonNullable<RouterOutputs["watchlist"]["get"]>["entries"][number];
}) {
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
						<DropdownMenuItem destructive>
							<TrashIcon size={16} />
							<span>Delete from list</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
