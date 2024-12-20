import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { EditingDescription } from "./editing-description";

export default function Description({
	watchlist,
	isOwner = false,
}: {
	watchlist: Pick<RouterOutputs["watchlist"]["get"], "description" | "id">;
	isOwner?: boolean;
}) {
	const [isEditing, setIsEditing] = useState<boolean>(false);

	if (
		!isEditing &&
		(!watchlist.description || watchlist.description.trim() === "") &&
		isOwner
	) {
		return (
			<div className="w-full my-4">
				<Button
					className="w-full h-16"
					variant={"outline"}
					onClick={() => setIsEditing(true)}
					before={<PlusIcon className="w-4 h-4" />}
				>
					Add a description
				</Button>
			</div>
		);
	}

	if (isEditing && isOwner) {
		return (
			<EditingDescription watchlist={watchlist} setIsEditing={setIsEditing} />
		);
	}

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div onClick={() => isOwner && setIsEditing(true)}>
			<div
				className={cn(
					isOwner &&
						"hover:bg-neutral-200 dark:hover:bg-neutral-800/50 cursor-pointer rounded-lg",
					"text-neutral-500 dark:text-neutral-400 my-4 text-md",
				)}
			>
				<div>
					{watchlist.description?.split("\n\n").map((paragraph, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<p className="my-5" key={index}>
							{paragraph}
						</p>
					))}
				</div>
			</div>
		</div>
	);
}
