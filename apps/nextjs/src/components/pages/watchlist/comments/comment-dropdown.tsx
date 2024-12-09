"use client";

import type React from "react";
import { useMemo, useState } from "react";

import { Ellipsis, FlagIcon, TrashIcon } from "lucide-react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";

import { Button } from "@serea/ui/button";
import { useConfirm } from "~/hooks/use-confirm";
import { api } from "~/trpc/react";

type MenuItem = {
	label: string;
	icon: React.ReactNode;
	onSelect: (commentId: string) => void;
	variant?: "destructive" | "default";
};

export default function CommentDropdown({
	onOpenChange,
	isOwner,
	commentId,
}: {
	onOpenChange: (isOpen: boolean) => void;
	commentId: string;
	isOwner: boolean;
}) {
	const { confirm } = useConfirm();

	const trpcUtils = api.useUtils();
	const { mutate: deleteComment, ...rest } = api.comments.delete.useMutation({
		onSuccess: () => {
			void trpcUtils.comments.get.invalidate();
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
				onSelect: (commentId: string) =>
					confirm({
						message: "You will not be able to undo this action.",
						title: "Delete comment?",
						onConfirm: () => deleteComment({ commentId }),
						loading: rest.isPending,
					}),
				variant: "destructive",
			},
		],
		[deleteComment, confirm, rest.isPending],
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
							onSelect={() => item.onSelect(commentId)}
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
