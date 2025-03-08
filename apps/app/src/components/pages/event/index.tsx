"use client";

import { redirect, useRouter } from "next/navigation";
import { api } from "~/trpc/react";

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

	return <div>{JSON.stringify(event)}</div>;
}
