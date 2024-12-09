"use client";

import type { RouterOutputs } from "@serea/api";
import Badge from "@serea/ui/badge";
import { LoadingButton } from "@serea/ui/loading-button";
import { api } from "~/trpc/react";
import CommentForm from "./comment-form";
import CommentRow from "./comment-row";

export default function CommentList({
	initialComments,
	watchlistId,
	currentUser,
}: {
	initialComments: RouterOutputs["comments"]["get"];
	watchlistId: string;
	currentUser: string;
}) {
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
		api.comments.get.useInfiniteQuery(
			{
				watchlistId,
				limit: 5,
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

	const comments = data?.pages.flatMap((page) => page.comments) ?? [];

	return (
		<div className="flex flex-col mt-4">
			<div className="flex items-center mb-2">
				<p className="font-medium dark:text-neutral-400 text-neutral-600 text-sm">
					Comments
				</p>
				{data?.pages[0]?.totalComments && (
					<Badge
						color="gray"
						className="ml-2 text-xs bg-surface-400 border font-medium text-neutral-600 border-surface-100"
					>
						{data.pages[0].totalComments}
					</Badge>
				)}
			</div>
			<CommentForm watchlistId={watchlistId} />
			<div className="mt-4">
				{comments.map((comment) => (
					<CommentRow
						currentUser={currentUser}
						comment={comment}
						key={comment.id}
					/>
				))}
				{hasNextPage && (
					<div className="w-full mt-2 justify-center items-center flex">
						<LoadingButton
							variant="outline"
							onClick={() => fetchNextPage()}
							loading={isFetchingNextPage}
							spinnerSize="xs"
							size="sm"
						>
							Load More Comments
						</LoadingButton>
					</div>
				)}
			</div>
		</div>
	);
}
