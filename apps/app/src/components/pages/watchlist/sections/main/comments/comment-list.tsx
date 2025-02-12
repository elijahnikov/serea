import type { RouterOutputs } from "@serea/api";
import { Avatar } from "@serea/ui/avatar";
import { Button } from "@serea/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	useForm,
} from "@serea/ui/form";
import { Input } from "@serea/ui/input";
import { LoadingButton } from "@serea/ui/loading-button";
import { Textarea } from "@serea/ui/textarea";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ChevronRightIcon, HeartIcon, MessageCircleIcon } from "lucide-react";
import * as React from "react";
import { z } from "zod";
import { formatNumber } from "~/lib/utils/general";
import { api } from "~/trpc/react";

dayjs.extend(relativeTime);

export default function CommentList({
	comments,
}: {
	comments: RouterOutputs["watchlist"]["getComments"];
}) {
	return (
		<div className="flex mt-8 flex-col gap-2">
			{comments.map((comment) => (
				<Comment key={comment.id} comment={comment} />
			))}
		</div>
	);
}

function Comment({
	comment,
}: {
	comment: RouterOutputs["watchlist"]["getComments"][number];
}) {
	const [showAllReplies, setShowAllReplies] = React.useState(false);
	const [showReplyInput, setShowReplyInput] = React.useState(false);
	console.log({ comment });
	const schema = z.object({
		content: z.string().min(1),
		parentId: z.string().optional(),
	});

	const form = useForm({
		schema,
		defaultValues: {
			content: "",
		},
	});

	const utils = api.useUtils();
	const reply = api.watchlist.createComment.useMutation({
		onSuccess: () => {
			setShowReplyInput(false);
			utils.watchlist.getComments.invalidate();
		},
	});
	const like = api.watchlist.likeComment.useMutation({
		onSuccess: () => {
			utils.watchlist.getComments.invalidate();
		},
		onMutate: async ({ commentId }) => {
			await utils.watchlist.getComments.cancel();

			const previousComments = utils.watchlist.getComments.getData();

			utils.watchlist.getComments.setData(
				{ id: comment.watchlistId },
				(old) => {
					if (!old) return old;

					return old.map((comment) => {
						if (comment.id === commentId) {
							return {
								...comment,
								liked: !comment.liked,
								_count: {
									...comment._count,
									likes: comment.liked
										? comment._count.likes - 1
										: comment._count.likes + 1,
								},
							};
						}

						if (comment.replies) {
							return {
								...comment,
								replies: comment.replies.map((reply) =>
									reply.id === commentId
										? {
												...reply,
												liked: !reply.liked,
												_count: {
													...reply._count,
													likes: reply.liked
														? reply._count.likes - 1
														: reply._count.likes + 1,
												},
											}
										: reply,
								),
							};
						}

						return comment;
					});
				},
			);

			return { previousComments };
		},
		onError: (_, __, context) => {
			if (context?.previousComments) {
				utils.watchlist.getComments.setData(
					{ id: comment.watchlistId },
					context.previousComments,
				);
			}
		},
	});

	const onSubmit = (data: z.infer<typeof schema>) => {
		reply.mutate({
			content: data.content,
			parentId: comment.id,
			watchlistId: comment.watchlistId,
		});
	};

	return (
		<div className="px-3 py-2  w-full flex flex-col gap-2 border-t">
			<div className="flex items-center gap-2">
				<Avatar
					src={comment.user.image ?? undefined}
					size="sm"
					initials={comment.user.name?.slice(0, 2) ?? ""}
				/>
				<p className="font-medium text-sm">{comment.user.name}</p>
				<p className="text-carbon-900 text-xs mt-[2px]">
					{dayjs(comment.createdAt).fromNow()}
				</p>
			</div>
			<div className="flex flex-col gap-2 ml-10">
				<div className="flex items-center gap-2">
					<p className="text-sm text-secondary-foreground">{comment.content}</p>
				</div>
				<div className="flex gap-2 mt-2">
					<Button
						onClick={() => {
							like.mutate({
								commentId: comment.id,
							});
						}}
						variant="outline"
						className="py-1.5 px-1"
					>
						<div className="flex">
							<HeartIcon
								data-liked={comment.liked}
								className="data-[liked=true]:fill-red-500 data-[liked=true]:text-red-500 data-[liked=false]:opacity-60"
								size={16}
								strokeWidth={2}
								aria-hidden="true"
							/>
							<span className="border-l dark:hover:border-carbon-dark-500 text-xs font-mono flex items-center justify-center ms-1 pl-2 -my-1.5">
								{formatNumber(comment._count.likes)}
							</span>
						</div>
					</Button>
					<Button
						className="py-1.5 pl-3 pr-2 text-xs [&_svg]:size-3.5"
						variant={"outline"}
						before={<MessageCircleIcon />}
						onClick={() => {
							form.reset({
								content: "",
							});
							setShowReplyInput(!showReplyInput);
						}}
					>
						Reply
					</Button>
				</div>
				{showReplyInput && (
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex flex-col gap-2 w-full"
						>
							<FormField
								control={form.control}
								name="content"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												className="resize-none"
												placeholder="Add a reply"
												onKeyDown={(e) => {
													if (e.key === "Enter" && !e.shiftKey) {
														e.preventDefault();
														form.handleSubmit(onSubmit)();
													}
												}}
												{...field}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</form>
						<div className="flex items-center ml-auto gap-2">
							<Button
								onClick={() => {
									setShowReplyInput(false);
									form.reset({
										content: "",
									});
								}}
								variant="outline"
								className="max-w-36"
							>
								Cancel
							</Button>
							<LoadingButton
								onClick={() => {
									form.handleSubmit(onSubmit)();
								}}
								loading={reply.isPending}
								type="submit"
								className="max-w-36"
							>
								Reply
							</LoadingButton>
						</div>
					</Form>
				)}
			</div>
			<div className="flex flex-col gap-2 ml-10">
				{comment.replies
					.slice(0, showAllReplies ? undefined : 4)
					.map((reply) => (
						<CommentReply
							likeComment={() => {
								like.mutate({
									commentId: reply.id,
								});
							}}
							key={reply.id}
							comment={reply}
						/>
					))}
				{comment.replies.length > 4 && (
					<Button
						onClick={() => setShowAllReplies(!showAllReplies)}
						after={
							<ChevronRightIcon
								data-open={showAllReplies}
								className="data-[open=true]:rotate-90 transition-transform duration-100"
							/>
						}
						variant="transparent"
						data-open={showAllReplies}
						className="py-1.5 px-1 mr-auto transition-all duration-200"
					>
						<p className="text-xs font-mono">
							{showAllReplies ? "Hide replies" : "Show replies"}
						</p>
					</Button>
				)}
			</div>
		</div>
	);
}

function CommentReply({
	comment,
	likeComment,
}: {
	comment: RouterOutputs["watchlist"]["getComments"][number]["replies"][number];
	likeComment: () => void;
}) {
	return (
		<div className="px-3 py-2  w-full flex flex-col gap-2 border-t">
			<div className="flex items-center gap-2">
				<Avatar
					src={comment.user.image ?? undefined}
					size="sm"
					initials={comment.user.name?.slice(0, 2) ?? ""}
				/>
				<p className="font-medium text-sm">{comment.user.name}</p>
				<p className="text-carbon-900 text-xs mt-[2px]">
					{dayjs(comment.createdAt).fromNow()}
				</p>
			</div>
			<div className="flex flex-col gap-2 ml-10">
				<div className="flex items-center gap-2">
					<p className="text-sm text-secondary-foreground">{comment.content}</p>
				</div>
				<div className="flex gap-2 mt-2">
					<Button
						onClick={likeComment}
						variant="outline"
						className="py-1.5 px-1"
					>
						<div className="flex">
							<HeartIcon
								data-liked={comment.liked}
								className="data-[liked=true]:fill-red-500 data-[liked=true]:text-red-500 data-[liked=false]:opacity-60"
								size={16}
								strokeWidth={2}
								aria-hidden="true"
							/>
							<span className="border-l dark:hover:border-carbon-dark-500 text-xs font-mono flex items-center justify-center ms-1 pl-2 -my-1.5">
								{formatNumber(comment._count.likes)}
							</span>
						</div>
					</Button>
				</div>
			</div>
		</div>
	);
}
