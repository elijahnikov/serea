import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui/cn";
import { Suspense } from "react";
import CommentsSection from "./comments";
import EntriesSection from "./entries";
import EventSection from "./event";
import MainHeader from "./header";

export default function MainSection({
	watchlist,
}: { watchlist: RouterOutputs["watchlist"]["get"] }) {
	return (
		<div
			className={cn(
				"flex w-full lg:mt-0 mt-8 max-w-[calc(100%-240px)] flex-col transition-all duration-300 ease-in-out",
			)}
		>
			{(watchlist.isMember || watchlist.isEditor || watchlist.isOwner) && (
				<EventSection watchlistId={watchlist.id} />
			)}
			<MainHeader watchlist={watchlist} />
			<Suspense fallback={<div>Loading entries...</div>}>
				<EntriesSection
					isEditor={watchlist.isEditor}
					isOwner={watchlist.isOwner}
					watchlistId={watchlist.id}
				/>
			</Suspense>
			<Suspense fallback={<div>Loading comments...</div>}>
				<CommentsSection watchlistId={watchlist.id} />
			</Suspense>
		</div>
	);
}
