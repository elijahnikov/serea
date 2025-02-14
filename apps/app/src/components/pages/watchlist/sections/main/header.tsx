import type { RouterOutputs } from "@serea/api";
import { ListIcon } from "lucide-react";
import WatchlistActions from "./actions";

export default function MainHeader({
	watchlist,
}: {
	watchlist: RouterOutputs["watchlist"]["get"];
}) {
	return (
		<div className="border-b h-max px-8 py-6">
			<div className="flex items-center gap-2 mb-2 text-carbon-900">
				<ListIcon className="w-4 h-4" />
				<p className="font-mono text-xs">WATCHLIST</p>
			</div>
			<div>
				<h1 className="font-medium text-3xl text-balance">{watchlist.title}</h1>
				<p className="text-sm text-carbon-900 mt-4">{watchlist.description}</p>
				<WatchlistActions
					comments={watchlist._count.comments}
					isLiked={watchlist.liked}
					likes={watchlist._count.likes}
					watchlistId={watchlist.id}
				/>
			</div>
		</div>
	);
}
