import type { RouterOutputs } from "@serea/api";
import { Badge } from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import dayjs from "dayjs";
import { DoorOpenIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { TMDB_IMAGE_BASE_URL_SD } from "~/lib/constants";
import EventCount from "./count";
import WatchProviders from "./watch-providerst";

export default function LiveEventView({
	event,
	showActionButton = true,
}: {
	event: RouterOutputs["watchEvent"]["getEventsForWatchlist"][number];
	showActionButton?: boolean;
}) {
	const eventDate = new Date(event.date);
	const runtime = event.entry.movie.runtime;
	const movieTitle = event.entry.movie.title;

	const endTime = new Date(eventDate);
	endTime.setMinutes(endTime.getMinutes() + runtime);

	const [uiState, setUiState] = React.useState({
		progress: 0,
		currentSeconds: 0,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		const updateProgress = () => {
			const now = new Date();
			const totalDuration = runtime * 60 * 1000; // runtime in ms
			const elapsed = now.getTime() - eventDate.getTime();

			const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
			const currentSeconds = Math.min(Math.floor(elapsed / 1000), runtime * 60);

			if (
				Math.abs(newProgress - uiState.progress) > 0.01 ||
				currentSeconds !== uiState.currentSeconds
			) {
				setUiState({
					progress: newProgress,
					currentSeconds: currentSeconds,
				});
			}
		};

		updateProgress();

		const interval = setInterval(updateProgress, 1000);

		return () => clearInterval(interval);
	}, [eventDate, runtime]);

	const formatMovieTime = (seconds: number) => {
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;
		return `${hrs}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const formatMovieRuntime = (minutes: number) => {
		const hrs = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hrs}:${mins.toString().padStart(2, "0")}:00`;
	};

	const currentTime = formatMovieTime(uiState.currentSeconds);
	const formattedRuntime = formatMovieRuntime(runtime);

	return (
		<>
			<div className="flex flex-col w-full">
				<div className="flex w-full items-center justify-between">
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
									color="green"
									size={"sm"}
									className="px-2 py-0.5 text-xs"
								>
									<div className="flex items-center gap-1">
										<div className="h-2 w-2 duration-1000 rounded-full bg-green-400 animate-custom-ping" />
										<p>Live</p>
									</div>
								</Badge>
							</div>

							<span className="text-carbon-900">
								{dayjs(eventDate).format("ddd MMMM D, YYYY [at] HH:mm")}
							</span>
						</div>
					</div>
					{!showActionButton && (
						<WatchProviders movieId={event.entry.movie.contentId} />
					)}
					{showActionButton && (
						<Link href={`/watchlist/${event.watchlistId}/event/${event.id}`}>
							<Button before={<DoorOpenIcon />}>Join</Button>
						</Link>
					)}
				</div>

				<div className="mt-4 mb-2">
					<div className="flex justify-between text-xs mt-1 font-medium text-carbon-600">
						<EventCount time={currentTime} />
						<span className="font-mono">{formattedRuntime}</span>
					</div>
				</div>
			</div>
			<>
				<div className="absolute bottom-0 left-0 w-full h-2" />
				<div
					className="absolute bottom-0 left-0 h-2 bg-green-400 transition-all duration-1000 overflow-hidden"
					style={{ width: `${uiState.progress}%` }}
				>
					<div
						className="absolute inset-0 animate-progress-stripes"
						style={{
							backgroundImage: `linear-gradient(
								45deg,
								rgba(0, 0, 0, 0.15) 25%,
								transparent 25%,
								transparent 50%,
								rgba(0, 0, 0, 0.15) 50%,
								rgba(0, 0, 0, 0.15) 75%,
								transparent 75%,
								transparent
							)`,
							backgroundSize: "20px 20px",
						}}
					/>
				</div>
			</>
		</>
	);
}
