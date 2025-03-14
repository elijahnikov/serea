"use client";

import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui/cn";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { useRouter } from "next/navigation";
import FinishedEventView from "../../watchlist/sections/main/event/finished-event-view";
import LiveEventView from "../../watchlist/sections/main/event/live-event-view";
import UpcomingEventView from "../../watchlist/sections/main/event/upcoming-event-view";

export default function EventView({
	eventData,
}: {
	eventData: RouterOutputs["watchEvent"]["getEvent"];
}) {
	const router = useRouter();

	const getInitialStatus = () => {
		if (!eventData) {
			return "upcoming";
		}

		const eventDate = new Date(eventData.date);
		const now = new Date();

		// Check if event is finished using the correct runtime path
		const runtime = eventData.entry?.movie?.runtime;
		if (runtime) {
			const endTime = new Date(eventDate.getTime() + runtime * 60 * 1000);
			if (now > endTime) {
				return "finished";
			}
		}

		return eventDate > now ? "upcoming" : "live";
	};

	const [eventStatus, setEventStatus] = React.useState<
		"upcoming" | "live" | "finished"
	>(getInitialStatus());

	const eventRef = React.useRef<RouterOutputs["watchEvent"]["getEvent"] | null>(
		null,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (!eventData) {
			return;
		}

		eventRef.current = eventData;

		const checkEventStatus = () => {
			if (!eventRef.current) return;

			const eventDate = new Date(eventRef.current.date);
			const now = new Date();

			let newStatus: "upcoming" | "live" | "finished" = "upcoming";

			// Check if event is finished using the correct runtime path
			const runtime = eventRef.current.entry?.movie?.runtime;
			if (runtime) {
				const endTime = new Date(eventDate.getTime() + runtime * 60 * 1000);
				if (now > endTime) {
					newStatus = "finished";
				} else if (now > eventDate) {
					newStatus = "live";
				}
			} else {
				// Fallback to original logic if no runtime
				newStatus = eventDate > now ? "upcoming" : "live";
			}

			if (newStatus !== eventStatus) {
				setEventStatus(newStatus);
				router.refresh();
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
	}, [eventData, eventStatus]);

	if (!eventData) {
		return null;
	}

	return (
		<div className={cn("pl-8 pr-8 border-b flex flex-col py-4 relative")}>
			<div className="flex items-center w-full mb-4 mt-2 text-carbon-900">
				<div className="flex items-center gap-2">
					<CalendarIcon className="w-4 h-4" />
					<p className="font-mono text-xs">EVENT</p>
				</div>
			</div>
			{eventStatus === "upcoming" ? (
				<UpcomingEventView event={eventData} />
			) : eventStatus === "live" ? (
				<LiveEventView event={eventData} showActionButton={false} />
			) : eventStatus === "finished" ? (
				<FinishedEventView event={eventData} />
			) : null}
		</div>
	);
}
