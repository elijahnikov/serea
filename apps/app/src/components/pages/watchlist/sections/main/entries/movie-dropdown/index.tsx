import type { RouterOutputs } from "@serea/api";
import { AvatarGroup, AvatarGroupItem } from "@serea/ui/avatar-group";
import { Button } from "@serea/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";
import { Spinner } from "@serea/ui/spinner";
import {
	CheckCheckIcon,
	EllipsisIcon,
	EyeIcon,
	TrashIcon,
	UserCheckIcon,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import WatchEventPopover from "./event-popover";

type MovieDropdownProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	role: "VIEWER" | "EDITOR" | "OWNER";
	entry: RouterOutputs["watchlist"]["getEntries"]["entries"][number];
};

type MenuItem = {
	label: string;
	icon: React.ReactNode;
	onSelect: (watchlistId: string, entryId: string) => void;
	variant?: "destructive" | "default";
};

export default function MovieDropdown({
	isOpen,
	entry,
	onOpenChange,
	role,
}: MovieDropdownProps) {
	const utils = api.useUtils();
	const deleteEntry = api.watchlist.deleteEntry.useMutation({
		onMutate: async ({ watchlistId, entryId }) => {
			await utils.watchlist.getEntries.cancel({ watchlistId });

			const previousEntries = utils.watchlist.getEntries.getData({
				watchlistId,
			});

			utils.watchlist.getEntries.setData({ watchlistId }, (old) => {
				if (!old) return old;

				const filteredEntries = old.entries.filter((e) => e.id !== entryId);

				const updatedEntries = filteredEntries.map((e, index) => ({
					...e,
					order: index,
				}));

				return {
					...old,
					entries: updatedEntries,
				};
			});

			return { previousEntries };
		},
		onError: (_, variables, context) => {
			if (context?.previousEntries) {
				utils.watchlist.getEntries.setData(
					{ watchlistId: variables.watchlistId },
					context.previousEntries,
				);
			}
		},
		onSuccess: () => {
			void utils.watchlist.getEntries.invalidate();
			void utils.watchlist.getMembers.invalidate();
		},
	});
	const createWatched = api.watched.create.useMutation({
		onSuccess: () => {
			void utils.watchlist.getEntries.invalidate();
			void utils.watchlist.getMembers.invalidate();
		},
	});
	const createWatchedForAll = api.watched.createForAll.useMutation({
		onSuccess: (data) => {
			toast.success(`Marked ${data.createdCount} members as watched.`);
			void utils.watchlist.getEntries.invalidate();
			void utils.watchlist.getMembers.invalidate();
		},
	});

	const editorOwnerItems: MenuItem[] = React.useMemo(
		() => [
			{
				label: "Toggle watched",
				icon: <EyeIcon size={16} />,
				onSelect: (watchlistId, entryId) => {
					createWatched.mutate({
						watchlistId: watchlistId,
						entryId: entryId,
					});
				},
			},
			{
				label: "Mark as watched for all",
				icon: <UserCheckIcon size={16} />,
				onSelect: (watchlistId, entryId) => {
					createWatchedForAll.mutate({
						watchlistId: watchlistId,
						entryId: entryId,
					});
				},
			},
			{
				label: "Delete from list",
				icon: <TrashIcon size={16} />,
				onSelect: (watchlistId, entryId) => {
					deleteEntry.mutate({
						watchlistId,
						entryId,
					});
				},
				variant: "destructive",
			},
		],
		[deleteEntry, createWatched, createWatchedForAll],
	);
	const roleToDropdownItems: Record<"VIEWER" | "EDITOR" | "OWNER", MenuItem[]> =
		React.useMemo(() => {
			return {
				VIEWER: [
					{
						label: "Toggle watched",
						icon: <EyeIcon size={16} />,
						onSelect: (watchlistId, entryId) => {
							createWatched.mutate({
								watchlistId: watchlistId,
								entryId: entryId,
							});
						},
					},
				],
				EDITOR: editorOwnerItems,
				OWNER: editorOwnerItems,
			};
		}, [editorOwnerItems, createWatched]);

	return (
		<DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button isIconOnly variant={"outline"} size="xs">
					<EllipsisIcon className="text-carbon-900" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={5}>
				<DropdownMenuGroup>
					<DropdownMenuItem className="pointer-events-none">
						<CheckCheckIcon size={16} />
						{createWatched.isPending ? (
							<Spinner size="sm" />
						) : entry.watched.length > 0 ? (
							<AvatarGroup
								moreLabel={
									entry.watched.length > 5
										? `+${entry.watched.length - 5}`
										: undefined
								}
								size="sm"
							>
								{entry.watched.slice(0, 5).map((watched) => (
									<AvatarGroupItem
										key={watched.id}
										src={watched.user.image ?? undefined}
										initials={watched.user.name ?? undefined}
									/>
								))}
							</AvatarGroup>
						) : (
							<span className="text-carbon-900">Not watched yet.</span>
						)}
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{role === "OWNER" && <WatchEventPopover entry={entry} />}
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
