"use client";

import { Badge } from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import dayjs from "dayjs";
import { CalendarIcon, XIcon } from "lucide-react";
import * as React from "react";
import { api } from "~/trpc/react";
import CurrentRuntimeCount from "./current-runtime-count";

export default function EventSection({
	watchlistId,
}: {
	watchlistId: string;
}) {
	const [eventsData] = api.watchEvent.getEventsForWatchlist.useSuspenseQuery({
		watchlistId,
	});

	const statusRef = React.useRef<"upcoming" | "live">("upcoming");

	const [uiState, setUiState] = React.useState<{
		progress: number;
		status: "upcoming" | "live";
		currentSeconds: number;
	}>({
		progress: 0,
		status: "upcoming",
		currentSeconds: 0,
	});

	if (
		!eventsData.length ||
		eventsData.length === 0 ||
		eventsData[0] === undefined ||
		eventsData[0].status === "finished"
	) {
		return null;
	}

	const event = eventsData[0];
	const eventDate = new Date(event.date);
	const runtime = event.entry.movie.runtime;
	const movieTitle = event.entry.movie.title;

	const endTime = new Date(eventDate);
	endTime.setMinutes(endTime.getMinutes() + runtime);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		const updateStatusAndProgress = () => {
			const now = new Date();

			const newStatus = eventDate > now ? "upcoming" : "live";
			const statusChanged = statusRef.current !== newStatus;
			statusRef.current = newStatus;

			let newProgress = 0;
			let currentSeconds = 0;
			if (newStatus === "live") {
				const totalDuration = runtime * 60 * 1000; // runtime in ms
				const elapsed = now.getTime() - eventDate.getTime();
				newProgress = Math.min((elapsed / totalDuration) * 100, 100);

				currentSeconds = Math.min(Math.floor(elapsed / 1000), runtime * 60);
			}

			if (
				statusChanged ||
				(newStatus === "live" &&
					(Math.abs(newProgress - uiState.progress) > 0.01 ||
						currentSeconds !== uiState.currentSeconds))
			) {
				setUiState({
					status: newStatus,
					progress: newProgress,
					currentSeconds: currentSeconds,
				});
			}
		};

		updateStatusAndProgress();

		const timeUntilStart = Math.max(
			0,
			eventDate.getTime() - new Date().getTime(),
		);

		const regularInterval = setInterval(updateStatusAndProgress, 1000);

		let transitionTimeout: NodeJS.Timeout | null = null;
		if (statusRef.current === "upcoming" && timeUntilStart > 0) {
			transitionTimeout = setTimeout(() => {
				updateStatusAndProgress();
			}, timeUntilStart + 1000);
		}

		return () => {
			clearInterval(regularInterval);
			if (transitionTimeout) clearTimeout(transitionTimeout);
		};
	}, [eventDate, runtime]);

	const formattedProgress = uiState.progress.toFixed(2);

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
		<div className={cn("pl-8 pr-8 border-b flex flex-col py-4 relative")}>
			<div className="flex items-center justify-between w-full">
				<div className="flex flex-col gap-2 w-full">
					<div className="flex items-center w-full text-carbon-900">
						<div className="flex items-center gap-2">
							<CalendarIcon className="w-4 h-4" />
							<p className="font-mono text-xs">EVENTS</p>
						</div>
					</div>
					<div className="font-medium gap-1 flex flex-col">
						<div className="flex items-center gap-3">
							<span className="font-bold">{movieTitle}</span>{" "}
							<Badge
								shape="pill"
								color={uiState.status === "live" ? "red" : "blue"}
								size={"sm"}
								className="px-2 py-0.5 text-xs"
							>
								<div className="flex items-center gap-1">
									<div className="h-2 w-2 duration-1000 rounded-full bg-red-400 animate-custom-ping" />
									<p>{uiState.status === "live" ? "LIVE" : "UPCOMING"}</p>
								</div>
							</Badge>
						</div>
						<span className="text-carbon-900">
							{dayjs(eventDate).format("ddd MMMM D, YYYY [at] HH:mm")}
						</span>
					</div>

					{uiState.status === "live" && (
						<div className="mt-2">
							<div className="flex  justify-between text-xs mt-1 text-carbon-600">
								<CurrentRuntimeCount time={currentTime} />
								<span className="font-medium font-mono">
									{formattedRuntime}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
			{uiState.status === "live" && (
				<>
					<div className="absolute bottom-0 left-0 w-full h-2" />
					<div
						className="absolute bottom-0 left-0 h-2 bg-primary transition-all duration-1000"
						style={{ width: `${uiState.progress}%` }}
					/>
				</>
			)}
		</div>
	);
}
