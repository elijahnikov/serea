"use client";

import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui/cn";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { api } from "~/trpc/react";

import LiveEventView from "./live-event-view";
import UpcomingEventView from "./upcoming-event-view";

type Event = RouterOutputs["watchEvent"]["getEventsForWatchlist"][number];

export default function EventSection({
	watchlistId,
}: {
	watchlistId: string;
}) {
	const [eventsData] = api.watchEvent.getEventsForWatchlist.useSuspenseQuery({
		watchlistId,
	});

	const getInitialStatus = () => {
		if (!eventsData.length || eventsData[0] === undefined) {
			return "upcoming";
		}

		const eventDate = new Date(eventsData[0].date);
		const now = new Date();
		return eventDate > now ? "upcoming" : "live";
	};

	const [eventStatus, setEventStatus] = React.useState<"upcoming" | "live">(
		getInitialStatus(),
	);

	const eventRef = React.useRef<Event | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (!eventsData.length || eventsData[0] === undefined) {
			return;
		}

		const event = eventsData[0];
		eventRef.current = event;

		const checkEventStatus = () => {
			if (!eventRef.current) return;

			const eventDate = new Date(eventRef.current.date);
			const now = new Date();

			const newStatus = eventDate > now ? "upcoming" : "live";

			if (newStatus !== eventStatus) {
				setEventStatus(newStatus);
			}
		};

		checkEventStatus();

		const statusInterval = setInterval(checkEventStatus, 1000);

		let transitionTimeout: NodeJS.Timeout | null = null;

		if (eventStatus === "upcoming" && eventRef.current) {
			const eventDate = new Date(eventRef.current.date);
			const timeUntilStart = Math.max(
				0,
				eventDate.getTime() - new Date().getTime(),
			);

			transitionTimeout = setTimeout(() => {
				checkEventStatus();
			}, timeUntilStart + 1000);
		}

		return () => {
			clearInterval(statusInterval);
			if (transitionTimeout) clearTimeout(transitionTimeout);
		};
	}, [eventsData, eventStatus, watchlistId]);

	if (!eventsData.length || eventsData[0] === undefined) {
		return null;
	}

	const event = eventsData[0];

	return (
		<div className={cn("pl-8 pr-8 border-b flex flex-col py-4 relative")}>
			<div className="flex items-center w-full mb-4 mt-2 text-carbon-900">
				<div className="flex items-center gap-2">
					<CalendarIcon className="w-4 h-4" />
					<p className="font-mono text-xs">EVENTS</p>
				</div>
			</div>
			{eventStatus === "upcoming" ? (
				<UpcomingEventView event={event} />
			) : (
				<LiveEventView event={event} />
			)}
		</div>
	);
}
