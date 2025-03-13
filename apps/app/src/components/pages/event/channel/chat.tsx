"use client";

import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import dayjs from "dayjs";
import * as React from "react";
import {
	useLiveMessages,
	useThrottledIsTypingMutation,
} from "~/lib/hooks/channel";
import { api } from "~/trpc/react";
import MessageForm from "./message-form";

export const pluralize = (count: number, singular: string, plural: string) =>
	count === 1 ? singular : plural;

export const listWithAnd = (list: string[]) => {
	if (list.length === 0) {
		return "";
	}
	if (list.length === 1) {
		return list[0];
	}
	if (list.length === 2) {
		return `${list[0]} and ${list[1]}`;
	}
	return `${list.slice(0, -1).join(", ")}, and ${list.at(-1)}`;
};

export default function Chat({
	channelId,
	currentUserId,
}: {
	channelId: string;
	currentUserId: string;
}) {
	const liveMessages = useLiveMessages(channelId);
	const currentlyTyping = api.channel.whoIsTyping.useSubscription({
		channelId,
	});

	const scrollRef = React.useRef<HTMLDivElement>(null);

	return (
		<div className="h-full flex flex-col">
			<div
				className="flex flex-1 flex-col-reverse max-h-[50vh] overflow-y-scroll p-4 sm:p-6 lg:p-8"
				ref={scrollRef}
			>
				<div>
					<div className="grid gap-4">
						{liveMessages.query.hasNextPage ? (
							<div>
								<Button
									disabled={
										!liveMessages.query.hasNextPage ||
										liveMessages.query.isFetchingNextPage
									}
									onClick={() => {
										void liveMessages.query.fetchNextPage();
									}}
								>
									{liveMessages.query.isFetchingNextPage
										? "Loading..."
										: !liveMessages.query.hasNextPage
											? "Fetched everything!"
											: "Load more"}
								</Button>
							</div>
						) : null}

						{liveMessages.messages?.map((item, index) => {
							const prevMessage =
								index > 0 ? liveMessages.messages?.[index - 1] : null;
							const nextMessage =
								index < (liveMessages.messages?.length || 0) - 1
									? liveMessages.messages?.[index + 1]
									: null;

							const isFirstInGroup =
								!prevMessage || prevMessage.user.id !== item.user.id;
							const isLastInGroup =
								!nextMessage || nextMessage.user.id !== item.user.id;

							const showUserInfo = isLastInGroup;
							const isOwner = item.user.id === currentUserId;

							return (
								<div
									key={item.id}
									className={cn(
										"flex items-start gap-3",
										isOwner ? "justify-end" : "justify-start",
										// Reduce gap between grouped messages
										!isFirstInGroup ? "-mt-3" : "",
									)}
								>
									<div className="flex flex-col gap-1">
										<div
											className={cn(
												"border px-3 py-2 text-sm rounded-lg",
												isOwner
													? "bg-gray-300 dark:bg-carbon-dark-400"
													: "bg-gray-200 dark:bg-carbon-dark-100",
											)}
										>
											<p>{item.content}</p>
										</div>
										{showUserInfo && (
											<div className="text-xs text-gray-500 dark:text-gray-400">
												<p>{item.user.name}</p>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
					{/* <p className="text-sm text-gray-400">
						{currentlyTyping.data?.length ? (
							`${listWithAnd(currentlyTyping.data)} ${pluralize(
								currentlyTyping.data.length,
								"is",
								"are",
							)} typing...`
						) : (
							<>&nbsp;</>
						)}
					</p> */}
				</div>
			</div>
			<MessageForm
				channelId={channelId}
				onPostCallback={() => {
					scrollRef.current?.scroll({
						top: 0,
						behavior: "smooth",
					});
				}}
			/>
		</div>
	);
}
