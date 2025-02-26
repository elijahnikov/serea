import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";
import {
	CalendarClockIcon,
	EllipsisIcon,
	EyeIcon,
	PencilIcon,
	TrashIcon,
	UserCheckIcon,
} from "lucide-react";
import * as React from "react";
import { api } from "~/trpc/react";

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
		onSuccess: () => {
			utils.watchlist.getEntries.invalidate();
		},
	});

	const editorOwnerItems: MenuItem[] = React.useMemo(
		() => [
			{
				label: "Set watch date",
				icon: <CalendarClockIcon size={16} />,
				onSelect: () => {},
			},
			{
				label: "Mark as watched",
				icon: <EyeIcon size={16} />,
				onSelect: () => {},
			},
			{
				label: "Mark as watched for all",
				icon: <UserCheckIcon size={16} />,
				onSelect: () => {},
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
		[deleteEntry],
	);
	const roleToDropdownItems: Record<"VIEWER" | "EDITOR" | "OWNER", MenuItem[]> =
		React.useMemo(() => {
			return {
				VIEWER: [
					{
						label: "Mark as watched",
						icon: <EyeIcon size={16} />,
						onSelect: () => {},
					},
				],
				EDITOR: editorOwnerItems,
				OWNER: editorOwnerItems,
			};
		}, [editorOwnerItems]);

	return (
		<DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button isIconOnly variant={"outline"} size="xs">
					<EllipsisIcon className="text-carbon-900" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" sideOffset={5}>
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
