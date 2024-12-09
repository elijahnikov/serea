"use client";

import type React from "react";
import { useMemo } from "react";

import {
	CalendarClockIcon,
	CheckCheck,
	Ellipsis,
	EyeIcon,
	FlagIcon,
	TrashIcon,
	UserCheckIcon,
} from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";

import type { RouterOutputs } from "@serea/api";
import { AvatarGroup } from "@serea/ui/avatar-group";
import { Button } from "@serea/ui/button";
import Loading from "@serea/ui/loading";
import { api } from "~/trpc/react";

type MenuItem = {
	label: string;
	icon: React.ReactNode;
	onSelect: (watchlistId: string, entryId: string) => void;
	variant?: "destructive" | "default";
};

export default function CommentDropdown({
	onOpenChange,
	isOpen,
	isOwner,
}: {
	onOpenChange: (isOpen: boolean) => void;
	isOpen: boolean;
	isOwner: boolean;
}) {
	const trpcUtils = api.useUtils();
	const toggleWatch = api.watched.toggleWatched.useMutation({
		onSuccess: () => {
			void trpcUtils.watchlist.getEntries.invalidate();
			void trpcUtils.watched.getWatchlistProgress.invalidate();
		},
	});
	const toggleAllWatched = api.watched.toggleAllWatched.useMutation({
		onSuccess: () => {
			void trpcUtils.watchlist.getEntries.invalidate();
			void trpcUtils.watched.getWatchlistProgress.invalidate();
		},
	});

	const ownerDropdownItems: MenuItem[] = useMemo(
		() => [
			{
				label: "Report",
				icon: <FlagIcon size={16} />,
				onSelect: () => {},
			},
			{
				label: "Delete",
				icon: <TrashIcon size={16} />,
				onSelect: () => {},
				variant: "destructive",
			},
		],
		[],
	);

	const viewerDropdownItems: MenuItem[] = useMemo(
		() => [
			{
				label: "Report",
				icon: <FlagIcon size={16} />,
				onSelect: () => {},
			},
		],
		[],
	);

	return (
		<DropdownMenu onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button
					size={"xs-icon"}
					className="focus:outline-none dark:hover:bg-neutral-800 focus:ring-0 h-6 w-6 "
					variant={"outline"}
				>
					<Ellipsis size={14} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					{(isOwner ? ownerDropdownItems : viewerDropdownItems).map((item) => (
						<DropdownMenuItem
							destructive={item.variant === "destructive"}
							key={item.label}
							// onSelect={() => item.onSelect(entry.watchlistId, entry.id)}
						>
							{item.icon}
							<span>{item.label}</span>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
