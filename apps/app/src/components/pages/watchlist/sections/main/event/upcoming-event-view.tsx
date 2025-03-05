import type { RouterOutputs } from "@serea/api";
import { Badge } from "@serea/ui/badge";
import dayjs from "dayjs";
import Image from "next/image";
import * as React from "react";
import { TMDB_IMAGE_BASE_URL_SD } from "~/lib/constants";
import EventCount from "./count";

export default function UpcomingEventView({
	event,
}: { event: RouterOutputs["watchEvent"]["getEventsForWatchlist"][number] }) {
	const eventDate = new Date(event.date);
	const movieTitle = event.entry.movie.title;

	const [countdown, setCountdown] = React.useState("");

	React.useEffect(() => {
		const updateCountdown = () => {
			const now = new Date();
			const timeRemaining = eventDate.getTime() - now.getTime();

			if (timeRemaining <= 0) {
				// Event has started
				setCountdown("00:00:00");
				return;
			}

			const totalSeconds = Math.floor(timeRemaining / 1000);
			const hours = Math.floor(totalSeconds / 3600);
			const minutes = Math.floor((totalSeconds % 3600) / 60);
			const seconds = totalSeconds % 60;

			const formattedHours = hours.toString().padStart(2, "0");
			const formattedMinutes = minutes.toString().padStart(2, "0");
			const formattedSeconds = seconds.toString().padStart(2, "0");

			setCountdown(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
		};

		// Initial update
		updateCountdown();

		// Update every second
		const interval = setInterval(updateCountdown, 1000);

		return () => clearInterval(interval);
	}, [eventDate]);

	return (
		<div className="flex flex-col w-full">
			<div className="flex w-full items-center gap-2">
				{event.entry.movie.poster && (
					<Image
						src={`${TMDB_IMAGE_BASE_URL_SD}${event.entry.movie.poster}`}
						alt={movieTitle}
						width={50}
						height={50}
						className="rounded-md border-[0.5px] shadow-sm dark:shadow-sm-dark object-cover"
					/>
				)}
				<div className="font-medium gap-1 flex flex-col">
					<div className="flex items-center gap-2">
						<span className="font-bold">{movieTitle}</span>
						<Badge
							shape="pill"
							color="red"
							size={"sm"}
							className="px-2 py-0.5 text-xs"
						>
							<div className="flex items-center gap-1">
								<p>Upcoming</p>
							</div>
						</Badge>
					</div>
					<span className="text-carbon-900">
						{dayjs(eventDate).format("ddd MMMM D, YYYY [at] HH:mm")}
					</span>
				</div>
				<div className="flex ml-auto mt-auto text-sm items-center gap-1">
					<span className="text-carbon-900">Starting in</span>
					<EventCount time={countdown} direction="down" />
				</div>
			</div>
		</div>
	);
}
