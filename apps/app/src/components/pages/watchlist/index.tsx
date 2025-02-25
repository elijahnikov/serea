"use client";

import { api } from "~/trpc/react";
import MainSection from "./sections/main";
import SideSection from "./sections/side";

export default function Watchlist({ id }: { id: string }) {
	const [watchlist] = api.watchlist.get.useSuspenseQuery({
		id,
	});
	console.log(watchlist);
	return (
		<main className="h-screen">
			<div className="flex max-h-screen overflow-y-auto">
				<MainSection watchlist={watchlist} />
				<SideSection watchlist={watchlist} />
			</div>
		</main>
	);
}
