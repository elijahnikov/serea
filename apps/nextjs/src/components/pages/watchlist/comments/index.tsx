import { api } from "~/trpc/server";
import CommentList from "./comment-list";

export default async function Comments({
	watchlistId,
}: { watchlistId: string }) {
	const comments = await api.comments.get({ watchlistId, limit: 20 });
	return <CommentList initialComments={comments} watchlistId={watchlistId} />;
}
