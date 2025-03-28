"use client";

import { skipToken } from "@tanstack/react-query";
import * as React from "react";
import { api } from "~/trpc/react";

export function useThrottledIsTypingMutation(channelId: string) {
	const isTyping = api.channel.isTyping.useMutation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	return React.useMemo(() => {
		let state = false;
		let timeout: ReturnType<typeof setTimeout> | null = null;

		function trigger() {
			timeout && clearTimeout(timeout);
			timeout = null;

			isTyping.mutate({
				channelId,
				typing: state,
			});
		}
		return (nextState: boolean) => {
			const shouldTriggerImmediately = nextState !== state;

			state = nextState;

			if (shouldTriggerImmediately) {
				trigger();
			} else if (!timeout) {
				timeout = setTimeout(trigger, 1000);
			}
		};
	}, [channelId]);
}

export function useLiveMessages(channelId: string) {
	const [, query] = api.message.getInfinite.useSuspenseInfiniteQuery(
		{
			channelId,
			take: 20,
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			refetchOnReconnect: false,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
		},
	);

	const [messages, setMessages] = React.useState(() => {
		const msgs = query.data?.pages.flatMap((page) => page.messages);
		return msgs ?? null;
	});
	const [lastEventId, setLastEventId] = React.useState<false | null | string>(
		false,
	);

	type Message = NonNullable<typeof messages>[number];

	const addMessages = React.useCallback((incoming?: Message[]) => {
		setMessages((current) => {
			const map: Record<Message["id"], Message> = {};
			for (const msg of current ?? []) {
				map[msg.id] = msg;
			}
			for (const msg of incoming ?? []) {
				map[msg.id] = msg;
			}
			return Object.values(map).sort(
				(a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
			);
		});
	}, []);

	React.useEffect(() => {
		const msgs = query.data?.pages.flatMap((page) => page.messages);
		addMessages(msgs);
	}, [query.data?.pages, addMessages]);

	if (messages && lastEventId === false) {
		setLastEventId(messages.at(-1)?.id ?? null);
	}

	const subscription = api.message.onAdd.useSubscription(
		lastEventId === false ? skipToken : { channelId, lastEventId },
		{
			onData(event) {
				addMessages([event.data]);
			},
			onError(error) {
				console.error("Subscription error:", error);

				const lastMessageEventId = messages?.at(-1)?.id;
				if (lastMessageEventId) {
					setLastEventId(lastMessageEventId);
				}
			},
		},
	);

	return { query, messages, subscription };
}

export function useJoinedChannel(channelId: string | undefined) {
	const joinChannel = api.channel.hasJoined.useMutation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	return React.useMemo(() => {
		// Return a no-op function if channelId is undefined
		if (!channelId) {
			return () => {};
		}

		// Return a function that can be called to update joined status
		return (isJoined: boolean) => {
			joinChannel.mutate({
				channelId,
				joined: isJoined,
			});
		};
	}, [channelId]);
}

export function useChannelParticipation(channelId: string | undefined) {
	const [participants, setParticipants] = React.useState<
		{
			id: string;
			name: string;
			image: string | null | undefined;
		}[]
	>([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [shouldRender, setShouldRender] = React.useState(false);

	React.useEffect(() => {
		const timer = setTimeout(() => {
			setShouldRender(true);
		}, 200);

		return () => clearTimeout(timer);
	}, []);

	api.channel.whoIsParticipating.useSubscription(
		channelId ? { channelId } : skipToken,
		{
			onData(data) {
				if (channelId) {
					console.log("Subscription update for participants:", data);
					setParticipants(data);
					setIsLoading(false);
				}
			},
			onError(error) {
				console.error("Participant subscription error:", error);
				setIsLoading(false);
			},
		},
	);

	React.useEffect(() => {
		if (!channelId) {
			setIsLoading(false);
		}
	}, [channelId]);

	return {
		participants,
		isLoading,
		shouldRender,
		hasParticipants: participants.length > 0,
	};
}
