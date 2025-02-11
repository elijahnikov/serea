import type { RouterOutputs } from "@serea/api";
import WatchlistActions from "./actions";

export default function MainHeader({
	watchlist,
}: {
	watchlist: RouterOutputs["watchlist"]["get"];
}) {
	return (
		<div>
			<h1 className="font-medium text-3xl text-balance">{watchlist.title}</h1>
			<p className="text-sm text-carbon-900">{watchlist.description}</p>
			<WatchlistActions
				isLiked={watchlist.liked}
				likes={watchlist._count.likes}
				watchlistId={watchlist.id}
			/>
		</div>
	);
}
