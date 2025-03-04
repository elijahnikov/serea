import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { DateTimePicker } from "@serea/ui/date-time-picker";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@serea/ui/dropdown-menu";
import { LoadingButton } from "@serea/ui/loading-button";
import { CalendarPlus2Icon, TrashIcon } from "lucide-react";
import * as React from "react";
import { api } from "~/trpc/react";

type WatchEventPopoverProps = {
	entry: RouterOutputs["watchlist"]["getEntries"]["entries"][number];
};

export default function WatchEventPopover({ entry }: WatchEventPopoverProps) {
	const [date, setDate] = React.useState<Date | undefined>(undefined);

	const utils = api.useUtils();
	const event = React.useMemo(() => entry.event[0], [entry]);
	const createWatchEvent = api.watchEvent.create.useMutation({
		onSuccess: () => {
			void utils.watchlist.getEntries.invalidate({
				watchlistId: entry.watchlistId,
			});
		},
	});

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<CalendarPlus2Icon />
				<span>Create new watch party</span>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="p-2">
				{event && (
					<div className="flex p-3 rounded-lg border dark:bg-carbon-dark-100 flex-col min-w-[300px] gap-2">
						<p className="text-sm font-medium">
							Watch event set for {event.date.toLocaleString()}
						</p>
						<div className="flex w-full gap-2">
							<Button
								before={<TrashIcon />}
								variant="destructive"
								className="ml-auto"
							>
								Delete
							</Button>
						</div>
					</div>
				)}

				{!event && (
					<div className="flex flex-col min-w-[300px] gap-2">
						<DateTimePicker
							granularity="minute"
							hourCycle={24}
							value={date}
							onChange={setDate}
						/>
						<LoadingButton
							onClick={() => {
								if (!date) return;
								createWatchEvent.mutate({
									watchlistId: entry.watchlistId,
									entryId: entry.id,
									date,
									runtime: entry.movie.runtime,
								});
							}}
							loading={createWatchEvent.isPending}
							disabled={typeof date === "undefined"}
							className="w-full"
						>
							Create watch party
						</LoadingButton>
					</div>
				)}
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
