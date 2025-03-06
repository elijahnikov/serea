"use client";

import { api } from "~/trpc/react";
import WatchEventChannel from "./sections/channel";
import MainSection from "./sections/main";
import SideSection from "./sections/side";

export default function Watchlist({ id }: { id: string }) {
	const [watchlist] = api.watchlist.get.useSuspenseQuery({
		id,
	});

	return (
		<main className="h-screen">
			<div className="flex max-h-screen overflow-y-auto">
				<MainSection watchlist={watchlist} />
				<SideSection watchlist={watchlist} />
				<WatchEventChannel />
			</div>
		</main>
	);
}
