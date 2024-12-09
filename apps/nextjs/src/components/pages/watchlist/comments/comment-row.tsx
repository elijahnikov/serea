import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import { Heart } from "lucide-react";
import moment from "moment";

import { useState } from "react";
import SereaAvatar from "~/components/common/serea-avatar";
import CommentDropdown from "./comment-dropdown";

export default function CommentRow({
	comment,
	currentUser,
}: {
	comment: RouterOutputs["comments"]["get"]["comments"][number];
	currentUser: string;
}) {
	const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
	return (
		<div className="group bg-background border-b first-of-type:rounded-t-lg last-of-type:rounded-b-lg border-surface-50 py-4 flex flex-col justify-center w-full">
			<div className="flex items-center gap-2 justify-between w-full ">
				<div className="flex items-center gap-2">
					<div className="flex items-center gap-2">
						<SereaAvatar
							url={comment.user.image}
							name={comment.user.name}
							size={"xs"}
						/>
						<div className="text-sm font-medium">
							<span className="font-bold">{comment.user.name}</span>{" "}
						</div>
					</div>
					<p className="text-xs text-neutral-400">
						{moment(comment.createdAt).fromNow()}
					</p>
				</div>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					className={`z-40 group-hover:opacity-100 opacity-0 transition-opacity duration-200 ${
						isDropdownOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"
					}`}
					onClick={(e) => e.stopPropagation()}
				>
					<CommentDropdown
						onOpenChange={setIsDropdownOpen}
						isOwner={currentUser === comment.user.id}
						commentId={comment.id}
					/>
				</div>
			</div>
			<p className="mt-2 text-sm dark:text-neutral-400 text-neutral-600">
				{comment.content}
			</p>
			<div className="flex items-center gap-2 mt-2">
				<Button size={"xs-icon"} variant={"outline"}>
					<div className="flex items-center space-x-1">
						<Heart
							size={14}
							className={cn(
								"fill-neutral-400 dark:fill-neutral-500 text-neutral-400 dark:text-neutral-500",
							)}
						/>
						<p className="text-neutral-600 text-xs dark:text-neutral-400">0</p>
					</div>
				</Button>
			</div>
		</div>
	);
}
