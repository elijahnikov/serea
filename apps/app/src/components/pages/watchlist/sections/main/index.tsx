import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui/cn";
import { Suspense } from "react";
import { useChannelStore } from "~/stores/channel";
import WatchEventChannel from "../channel";
import CommentsSection from "./comments";
import EntriesSection from "./entries";
import EventSection from "./event";
import MainHeader from "./header";

export default function MainSection({
	watchlist,
}: { watchlist: RouterOutputs["watchlist"]["get"] }) {
	const { currentChannelId } = useChannelStore();
	return (
		<div
			className={cn(
				"flex w-full lg:mt-0 mt-8 max-w-[calc(100%-240px)] flex-col transition-all duration-300 ease-in-out",
				currentChannelId && "max-w-[calc(100%-240px-240px)]",
			)}
		>
			{(watchlist.isMember || watchlist.isEditor || watchlist.isOwner) && (
				<Suspense>
					<EventSection watchlistId={watchlist.id} />
				</Suspense>
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
