"use client";

import type { RouterOutputs } from "@serea/api";
import Badge from "@serea/ui/badge";
import moment from "moment";
import Actions from "../actions";
import Entries from "../entries";
import Description from "./editing/description";
import Title from "./editing/title";

export default function MainSection({
	watchlist,
	view,
	initialEntries,
	initialLikes,
	isOwner = false,
}: {
	watchlist: Omit<RouterOutputs["watchlist"]["get"], "user">;
	initialEntries: RouterOutputs["watchlist"]["getEntries"];
	initialLikes: RouterOutputs["watchlist"]["getLikes"];
	view: "grid" | "row";
	isOwner?: boolean;
}) {
	return (
		<div className="w-full order-last gap-6 flex flex-col lg:order-first">
			<div className="mt-4">
				<Title isOwner={isOwner} watchlist={{ ...watchlist }} />
				<Description isOwner={isOwner} watchlist={{ ...watchlist }} />
				<div className="flex gap-2">
					<Badge stroke className="text-xs text-secondary-500">
						<span>Created</span>{" "}
						<span className="font-semibold text-black dark:text-white">
							{moment(watchlist.createdAt).format("MMMM Do YYYY")}
						</span>
					</Badge>
					<Badge stroke className="text-xs text-secondary-500">
						<span>Updated</span>{" "}
						<span className="font-semibold text-black dark:text-white">
							{moment(watchlist.updatedAt).format("MMMM Do YYYY")}
						</span>
					</Badge>
				</div>
			</div>
			<Actions watchlistId={watchlist.id} initialLikes={initialLikes} />
			<Entries
				watchlistId={watchlist.id}
				view={view}
				entries={initialEntries}
			/>
		</div>
	);
}
