"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import EventView from "./event-view";
import EventHeader from "./header";

export default function Event({
	eventId,
	watchlistId,
}: {
	eventId: string;
	watchlistId: string;
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
		<>
			<EventHeader event={event} />
			<EventView eventData={event} />
		</>
	);
}
