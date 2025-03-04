import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { DateTimePicker } from "@serea/ui/date-time-picker";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@serea/ui/dropdown-menu";
import { LoadingButton } from "@serea/ui/loading-button";
import {
	CalendarIcon,
	CalendarPlus2Icon,
	ClockIcon,
	TrashIcon,
} from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
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
			toast.success(`Watch party created for ${entry.movie.title}`);
		},
	});
	const deleteWatchEvent = api.watchEvent.delete.useMutation({
		onSuccess: () => {
			void utils.watchlist.getEntries.invalidate({
				watchlistId: entry.watchlistId,
			});
			toast.success(`Watch party deleted for ${entry.movie.title}`);
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
					<div className="flex p-3 items-center justify-between rounded-lg border dark:bg-carbon-dark-100 gap-1 w-[300px]">
						<div className="flex w-full gap-1 flex-col ">
							<div className="flex w-full items-center gap-2">
								<CalendarIcon className="w-4 h-4" />
								<p className="text-sm whitespace-nowrap font-medium">
									{event.date.toLocaleDateString("en-US", {
										day: "numeric",
										month: "long",
										year: "numeric",
									})}{" "}
									at{" "}
									{event.date.toLocaleTimeString("en-US", {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</p>
							</div>
							<div className="flex items-center gap-2">
								<ClockIcon className="w-4 h-4" />
								<p className="text-sm text-carbon-500">
									{entry.movie.runtime} minutes
								</p>
							</div>
						</div>
						<div className="w-full ml-4 gap-2">
							<LoadingButton
								loading={deleteWatchEvent.isPending}
								variant="destructive"
								className="px-1"
								onClick={() => {
									deleteWatchEvent.mutate({ id: event.id });
								}}
							>
								<TrashIcon className="w-4 h-4" />
							</LoadingButton>
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
