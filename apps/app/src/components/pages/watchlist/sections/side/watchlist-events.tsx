"use client";

import type { RouterOutputs } from "@serea/api";
import dayjs from "dayjs";
import Image from "next/image";
import { TMDB_IMAGE_BASE_URL_SD } from "~/lib/constants";
import { api } from "~/trpc/react";

export default function WatchlistEvents({
	watchlist,
}: { watchlist: RouterOutputs["watchlist"]["get"] }) {
	const [events] = api.watchEvent.getAllEventsForWatchlist.useSuspenseQuery({
		watchlistId: watchlist.id,
	});
	if (events.length === 0) return null;
	return (
		<div>
			<p className="text-xs font-mono text-carbon-900">EVENTS</p>
			<div className="flex mt-2 flex-col gap-2">
				{events.map((event) => (
					<div key={event.id}>
						<div className="flex gap-2">
							{event.entry.movie.poster && (
								<Image
									src={`${TMDB_IMAGE_BASE_URL_SD}${event.entry.movie.poster}`}
									alt={event.entry.movie.title}
									width={40}
									height={40}
									className="rounded-md border-[0.5px] shadow-sm dark:shadow-sm-dark object-cover"
								/>
							)}
							<div className="flex flex-col">
								<p className="text-sm font-medium">{event.entry.movie.title}</p>
								<p className="text-xs text-balance text-carbon-600">
									{dayjs(event.date).format("ddd MMMM D, YYYY [at] HH:mm")}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
