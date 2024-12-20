"use client";

import type React from "react";
import { useMemo } from "react";

import {
	CalendarClockIcon,
	CheckCheck,
	Ellipsis,
	EyeIcon,
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

import { AvatarGroup } from "@serea/ui/avatar-group";
import { Button } from "@serea/ui/button";
import type { RouterOutputs } from "@serea/api";
import { api } from "~/trpc/react";
import Loading from "@serea/ui/loading";

type MenuItem = {
	label: string;
	icon: React.ReactNode;
	onSelect: (watchlistId: string, entryId: string) => void;
	variant?: "destructive" | "default";
};

export default function MovieDropdown({
	entry,
	onDeleteEntry,
	onOpenChange,
	role,
	isOpen,
}: {
	entry: RouterOutputs["watchlist"]["getEntries"][number];
	onDeleteEntry: (entryId: string) => void;
	onOpenChange: (isOpen: boolean) => void;
	role: "owner" | "editor" | "viewer" | "non-member";
	isOpen: boolean;
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

	const editorOwner: MenuItem[] = useMemo(
		() => [
			{
				label: "Set watch date",
				icon: <CalendarClockIcon size={16} />,
				onSelect: () => {},
			},
			{
				label: "Mark as watched",
				icon: <EyeIcon size={16} />,
				onSelect: (watchlistId: string, entryId: string) =>
					toggleWatch.mutate({ watchlistId, entryId }),
			},
			{
				label: "Mark as watched for all",
				icon: <UserCheckIcon size={16} />,
				onSelect: (watchlistId: string, entryId: string) =>
					toggleAllWatched.mutate({ watchlistId, entryId }),
			},
			{
				label: "Delete from list",
				icon: <TrashIcon size={16} />,
				onSelect: () => {
					onDeleteEntry(entry.id);
				},
				variant: "destructive",
			},
		],
		[entry.id, onDeleteEntry, toggleWatch, toggleAllWatched],
	);

	const roleToDropdownItems: Record<"owner" | "editor" | "viewer", MenuItem[]> =
		useMemo(
			() => ({
				owner: editorOwner,
				editor: editorOwner,
				viewer: [
					{
						label: "Mark as watched",
						icon: <EyeIcon size={16} />,
						onSelect: (watchlistId: string, entryId: string) =>
							toggleWatch.mutate({ watchlistId, entryId }),
					},
				],
			}),
			[editorOwner, toggleWatch],
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
					<DropdownMenuItem className="pointer-events-none">
						<CheckCheck size={16} />
						{toggleAllWatched.isPending || toggleWatch.isPending ? (
							<Loading type="spinner" size="xs" />
						) : entry.watched && entry.watched.length > 0 ? (
							<AvatarGroup
								size="sm"
								items={entry.watched.slice(0, 4).map((watched) => {
									return {
										src: watched.user.image ?? undefined,
										alt: watched.user.name ?? undefined,
										initials: watched.user.name?.charAt(0),
									};
								})}
								moreLabel={
									entry.watched.length > 4
										? `+${entry.watched.length - 4}`
										: null
								}
							/>
						) : (
							<span className="text-neutral-500">Not watched yet.</span>
						)}
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{roleToDropdownItems[role as keyof typeof roleToDropdownItems].map(
						(item) => (
							<DropdownMenuItem
								destructive={item.variant === "destructive"}
								key={item.label}
								onSelect={() => item.onSelect(entry.watchlistId, entry.id)}
							>
								{item.icon}
								<span>{item.label}</span>
							</DropdownMenuItem>
						),
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
