"use server";

import { getSession } from "@serea/auth";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { api } from "~/trpc/server";
import WatchlistHeader from "./header";
import MainSection from "./main-section";
import MembersProgress from "./member-progress";
import Tags from "./tags";

export default async function SingleWatchlist({ id }: { id: string }) {
	const session = await getSession();

	const [watchlist, entries, likes, watchlistProgress] = await Promise.all([
		api.watchlist.get({ id }),
		api.watchlist.getEntries({ id }),
		api.watchlist.getLikes({ id }),
		api.watched.getWatchlistProgress({ id }),
	]);

	const cookieStore = cookies();
	const view = cookieStore.get("selected-view");

	return (
		<>
			<Suspense fallback={<p>loading2...</p>}>
				<WatchlistHeader
					owner={watchlist.user}
					isOwner={session?.user.id === watchlist.userId}
					watchlist={{ ...watchlist }}
				/>
			</Suspense>
			<div className="flex flex-col gap-4 lg:flex-row">
				<MainSection
					isOwner={session?.user.id === watchlist.userId}
					initialWatchlist={watchlist}
					initialEntries={entries}
					initialLikes={likes}
					view={view?.value as "grid" | "row" | null}
				/>
				<div className="w-full mt-16 gap-6 flex flex-col lg:w-1/3 order-first lg:order-last">
					<Tags
						watchlist={{ ...watchlist }}
						isOwner={session?.user.id === watchlist.userId}
					/>
					<Suspense fallback={<p>loading3...</p>}>
						<MembersProgress watchlistId={id} initialData={watchlistProgress} />
					</Suspense>
				</div>
			</div>
		</>
	);
}
