"use client";

import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { Calendar } from "@serea/ui/calendar";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@serea/ui/dropdown-menu";
import { LoadingButton } from "@serea/ui/loading-button";
import { CalendarCheck2Icon, CalendarIcon } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { api } from "~/trpc/react";

export default function WatchDatePopover({
	entry,
}: {
	entry: RouterOutputs["watchlist"]["getEntries"]["entries"][number];
}) {
	const [date, setDate] = React.useState<Date | undefined>();

	const createEvent = api.watchlist.createEvent.useMutation({
		onSuccess: (_, variables) => {
			toast.success(
				`Watch event created on ${variables.date} for ${entry.movie.title}`,
			);
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<>
					<CalendarIcon size={16} />
					<span>Events</span>
				</>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="p-2">
				{entry.events.length > 0 ? (
					<div>
						<h1>Watch party event set for</h1>
						<span>
							{entry.events[0]?.date.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric",
							})}
						</span>
					</div>
				) : (
					<>
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							className="rounded-lg border"
						/>
						<div className="flex gap-2 items-center w-full mt-2">
							<LoadingButton
								disabled={typeof date === "undefined"}
								loading={createEvent.isPending}
								className="w-full"
								onClick={() => {
									if (date)
										createEvent.mutate({
											entryId: entry.id,
											watchlistId: entry.watchlistId,
											date: date,
										});
								}}
							>
								Confirm
							</LoadingButton>
						</div>
					</>
				)}
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
