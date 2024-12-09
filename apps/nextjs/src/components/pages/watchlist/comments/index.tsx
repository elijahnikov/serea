import { getSession } from "@serea/auth";
import { api } from "~/trpc/server";
import CommentList from "./comment-list";

export default async function Comments({
	watchlistId,
}: { watchlistId: string }) {
	const comments = await api.comments.get({ watchlistId, limit: 5 });
	const session = await getSession();
	return (
		<CommentList
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			currentUser={session?.user.id!}
			initialComments={comments}
			watchlistId={watchlistId}
		/>
	);
}
