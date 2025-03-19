"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import EventChannel from "./channel";
import EventView from "./event-view";
import EventHeader from "./header";

export default function Event({
	eventId,
	watchlistId,
	currentUserId,
}: {
	eventId: string;
	watchlistId: string;
	currentUserId: string;
}) {
	const router = useRouter();
	const [event, { isError }] = api.watchEvent.getEvent.useSuspenseQuery({
		eventId,
		watchlistId,
	});

	if (!event || isError) {
		router.push(`/watchlist/${watchlistId}`);
	}

	return (
		<div className="flex flex-col h-full min-h-screen max-h-screen overflow-hidden">
			<EventHeader event={event} />
			<EventView eventData={event} />
			<EventChannel
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				channelId={event.channel!.id}
				currentUserId={currentUserId}
			/>
		</div>
	);
}
