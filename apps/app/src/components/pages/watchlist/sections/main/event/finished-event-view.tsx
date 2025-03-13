import type { RouterOutputs } from "@serea/api";
import { Badge } from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import dayjs from "dayjs";
import { CheckCircleIcon, PencilLineIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { TMDB_IMAGE_BASE_URL_SD } from "~/lib/constants";

export default function LiveEventView({
	event,
	showActionButton = true,
}: {
	event: RouterOutputs["watchEvent"]["getEventsForWatchlist"][number];
	showActionButton?: boolean;
}) {
	const eventDate = new Date(event.date);
	const movieTitle = event.entry.movie.title;

	return (
		<>
			<div className="flex flex-col pb-4 w-full">
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
									color="blue"
									size={"sm"}
									className="px-2 py-0.5 text-xs"
									before={<CheckCircleIcon />}
								>
									<div className="flex items-center gap-1">
										<p>Finished</p>
									</div>
								</Badge>
							</div>

							<span className="text-carbon-900">
								{dayjs(eventDate).format("ddd MMMM D, YYYY [at] HH:mm")}
							</span>
						</div>
					</div>

					{showActionButton && (
						<Link href={`/review/${event.entry.movie.id}`}>
							<Button before={<PencilLineIcon />}>Write a review</Button>
						</Link>
					)}
				</div>
			</div>
		</>
	);
}
