import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import { Heart, HeartIcon, MessageCircle } from "lucide-react";
import moment from "moment";
import SereaAvatar from "~/components/common/serea-avatar";

export default function CommentRow({
	comment,
}: { comment: RouterOutputs["comments"]["get"]["comments"][number] }) {
	return (
		<div className="bg-background first-of-type:rounded-t-lg last-of-type:rounded-b-lg border-surface-50 py-4 flex flex-col justify-center w-full">
			<div className="flex items-center gap-2 justify-between w-full ">
				<div className="flex items-center gap-2">
					<SereaAvatar
						url={comment.user.image}
						name={comment.user.name}
						size={"xs"}
					/>
					<div className="text-sm font-medium">
						<span className="font-bold">{comment.user.name}</span>{" "}
						<span className="text-neutral-400">says</span>
					</div>
				</div>
				<p className="text-xs text-neutral-400">
					{moment(comment.createdAt).fromNow()}
				</p>
			</div>
			<p className="mt-2">{comment.content}</p>
			<div className="flex items-center gap-2 mt-2">
				<Button size={"xs-icon"} variant={"transparent"}>
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
