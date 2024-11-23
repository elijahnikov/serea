"use server";

import { getSession } from "@serea/auth";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { api } from "~/trpc/server";
import WatchlistHeader from "./header";
import MainSection from "./main-section";
import Tags from "./tags";

export default async function SingleWatchlist({ id }: { id: string }) {
	const session = await getSession();

	const watchlist = await api.watchlist.get({ id });
	const entries = await api.watchlist.getEntries({ id });
	const likes = await api.watchlist.getLikes({ id });

	const cookieStore = cookies();
	const view = cookieStore.get("selected-view");

	return (
		<>
			<Suspense fallback={<p>loading2...</p>}>
				<WatchlistHeader
					owner={watchlist.user}
					isOwner={session?.user.id === watchlist.userId}
					watchlistId={watchlist.id}
				/>
			</Suspense>
			<div className="flex flex-col gap-4 lg:flex-row">
				<MainSection
					initialEntries={entries}
					view={view?.value as "grid" | "row" | null}
					watchlist={watchlist}
				/>
				<div className="w-full mt-16 lg:w-1/3 order-first lg:order-last">
					<Tags tags={watchlist.tags} />
				</div>
			</div>
		</>
	);
}
