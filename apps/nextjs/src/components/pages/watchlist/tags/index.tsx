"use client";

import type { RouterOutputs } from "@serea/api";
import Badge from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import EditingTags from "./editing-tags";

export default function Tags({
	watchlist,
	isOwner = false,
}: {
	watchlist: Pick<RouterOutputs["watchlist"]["get"], "tags" | "id">;
	isOwner?: boolean;
}) {
	const [isEditing, setIsEditing] = useState<boolean>(false);

	if (isEditing && isOwner) {
		return (
			<div className="flex flex-col mt-4">
				<p className="font-medium dark:text-neutral-400 text-neutral-600 text-sm mb-2">
					Tagged
				</p>
				<EditingTags watchlist={watchlist} setIsEditing={setIsEditing} />
			</div>
		);
	}

	if (
		!isEditing &&
		(!watchlist.tags || watchlist.tags.trim() === "") &&
		isOwner
	) {
		return (
			<div className="w-full flex flex-col mt-4">
				<p className="font-medium dark:text-neutral-400 text-neutral-600 text-sm mb-2">
					Tagged
				</p>
				<Button
					className="w-full hover:bg-neutral-200 dark:hover:bg-neutral-800/50"
					variant={"tertiary"}
					onClick={() => setIsEditing(true)}
					before={<PlusIcon className="w-4 h-4" />}
				>
					Add tags
				</Button>
			</div>
		);
	}

	if (!watchlist.tags) return null;

	return (
		<div className="flex flex-col ">
			<p className="font-medium dark:text-neutral-400 text-neutral-600 text-sm mb-2">
				Tagged
			</p>
			{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
			<div
				onClick={() => isOwner && setIsEditing(true)}
				className={cn(
					"flex flex-wrap gap-2",
					isOwner &&
						"hover:bg-neutral-200 dark:hover:bg-neutral-800/50 cursor-pointer rounded-lg",
				)}
			>
				{watchlist.tags.split(",").map((tag, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Badge key={index} stroke className="text-sm text-secondary-500">
						{tag}
					</Badge>
				))}
			</div>
		</div>
	);
}
