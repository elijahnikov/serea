"use client";

import type { RouterOutputs } from "@serea/api";
import Loading, { Spinner } from "@serea/ui/loading";
import { useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { api } from "~/trpc/react";
import CommentForm from "./comment-form";
import CommentRow from "./comment-row";

export default function CommentList({
	initialComments,
	watchlistId,
}: { initialComments: RouterOutputs["comments"]["get"]; watchlistId: string }) {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
		api.comments.get.useInfiniteQuery(
			{
				watchlistId,
				limit: 20,
			},
			{
				initialData: {
					pages: [initialComments],
					pageParams: [undefined],
				},
				staleTime: Number.POSITIVE_INFINITY,
				getNextPageParam: (lastPage) => lastPage.nextCursor,
				refetchOnWindowFocus: false,
			},
		);

	const comments = useMemo(
		() => data?.pages.flatMap((page) => page.comments) ?? [],
		[data],
	);

	return (
		<div className="flex flex-col">
			<h1 className="text-lg mb-2 font-semibold">Comments</h1>
			{/* <InfiniteScroll
				dataLength={comments.length}
				next={fetchNextPage}
				hasMore={hasNextPage}
				loader={<Loading type="spinner" />}
			> */}
			<CommentForm watchlistId={watchlistId} />
			{comments.map((comment) => (
				<CommentRow comment={comment} key={comment.id} />
			))}
			{/* </InfiniteScroll> */}
		</div>
	);
}
