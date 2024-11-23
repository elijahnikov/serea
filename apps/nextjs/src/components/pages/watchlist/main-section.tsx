"use client";

import type { RouterOutputs } from "@serea/api";
import Badge from "@serea/ui/badge";
import moment from "moment";
import { useState } from "react";
import Entries from "./entries";
import { api } from "~/trpc/react";

export default function MainSection({
	watchlist,
	view,
	initialEntries,
}: {
	watchlist: Omit<RouterOutputs["watchlist"]["get"], "user">;
	initialEntries: RouterOutputs["watchlist"]["getEntries"];
	view: "grid" | "row";
}) {
	return (
		<div className="w-full order-last gap-6 flex flex-col lg:order-first">
			<div className="mt-4">
				<p className="text-3xl font-semibold">{watchlist.title}</p>
				<p className=" text-neutral-500 dark:text-neutral-400 my-4 text-md">
					{watchlist.description}
				</p>
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
			<Entries
				watchlistId={watchlist.id}
				view={view}
				entries={initialEntries}
			/>
		</div>
	);
}
