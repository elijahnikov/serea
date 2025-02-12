import type { RouterOutputs } from "@serea/api";
import { MessageCircleIcon, SendIcon } from "lucide-react";
import * as React from "react";
import { api } from "~/trpc/react";
import AddCommentForm from "./add-comment-form";
import CommentList from "./comment-list";

type Comment = RouterOutputs["watchlist"]["getComments"][number];

function organizeComments(comments: Comment[]) {
	const commentMap = new Map<string, Comment>();
	const topLevelComments: Comment[] = [];

	for (const comment of comments) {
		commentMap.set(comment.id, { ...comment, replies: [] });
	}

	for (const comment of comments) {
		const processedComment = commentMap.get(comment.id);

		if (!processedComment) continue;
		if (comment.parentId === null) {
			topLevelComments.push(processedComment);
		} else {
			const parentComment = commentMap.get(comment.parentId);
			if (parentComment) {
				parentComment.replies.push(processedComment);
			}
		}
	}

	return topLevelComments;
}
export default function CommentsSection({
	watchlistId,
}: {
	watchlistId: string;
}) {
	const [comments] = api.watchlist.getComments.useSuspenseQuery({
		id: watchlistId,
	});
	const organizedComments = React.useMemo(
		() => organizeComments(comments),
		[comments],
	);

	console.log({ comments, organizedComments });

	return (
		<div className="pl-8 pr-14 border-b py-6">
			<div className="flex items-center gap-2 text-carbon-900">
				<MessageCircleIcon className="w-4 h-4" />
				<p className="font-mono text-xs">COMMENTS</p>
				<p className="text-xs text-carbon-500">{comments.length}</p>
			</div>
			<AddCommentForm watchlistId={watchlistId} />
			<CommentList comments={organizedComments} />
		</div>
	);
}
