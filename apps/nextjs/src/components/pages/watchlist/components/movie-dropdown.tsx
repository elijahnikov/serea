"use client";

import type React from "react";
import { useMemo } from "react";

import {
	EyeIcon,
	UserCheckIcon,
	TrashIcon,
	Ellipsis,
	CalendarClockIcon,
} from "lucide-react";

import type { RouterOutputs } from "@serea/api";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";

import { Button } from "@serea/ui/button";

type MenuItem = {
	label: string;
	icon: React.ReactNode;
	onSelect: (event: Event) => void;
	variant?: "destructive" | "default";
};

export default function MovieDropdown({
	entry,
	onDeleteEntry,
	onOpenChange,
	role,
}: {
	entry: NonNullable<RouterOutputs["watchlist"]["getEntries"]>[number];
	onDeleteEntry: (entryId: string) => void;
	onOpenChange: (isOpen: boolean) => void;
	role: "owner" | "editor" | "viewer" | "non-member";
}) {
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
				onSelect: () => {
					onDeleteEntry(entry.id);
				},
				variant: "destructive",
			},
		],
		[entry.id, onDeleteEntry],
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
						onSelect: () => {},
					},
				],
			}),
			[editorOwner],
		);

	return (
		<DropdownMenu onOpenChange={onOpenChange}>
			<DropdownMenuTrigger asChild>
				<Button
					size={"xs-icon"}
					className="focus:outline-none focus:ring-0 bg-white h-6 w-6"
					variant={"outline"}
				>
					<Ellipsis size={14} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuGroup>
					{roleToDropdownItems[role as keyof typeof roleToDropdownItems].map(
						(item) => (
							<DropdownMenuItem
								destructive={item.variant === "destructive"}
								key={item.label}
								onSelect={(e) => item.onSelect(e)}
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
