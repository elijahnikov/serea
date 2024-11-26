"use client";

import type { RouterOutputs } from "@serea/api";
import { useState } from "react";
import { z } from "zod";
import EditingTitle from "./editing-title";
import { cn } from "@serea/ui/cn";

const updateTitleSchema = z.object({
	title: z.string().min(1, { message: "Please enter a title." }),
});

export default function Title({
	watchlist,
	isOwner = false,
}: {
	watchlist: Pick<RouterOutputs["watchlist"]["get"], "title" | "id">;
	isOwner?: boolean;
}) {
	const [isEditing, setIsEditing] = useState<boolean>(false);

	if (isEditing && isOwner) {
		return <EditingTitle watchlist={watchlist} setIsEditing={setIsEditing} />;
	}

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div onClick={() => isOwner && setIsEditing(true)}>
			<p
				className={cn(
					isOwner &&
						"hover:bg-neutral-200 dark:hover:bg-neutral-800/50 cursor-pointer rounded-lg",
					"text-3xl font-semibold",
				)}
			>
				{watchlist.title}
			</p>
		</div>
	);
}
