import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { DateTimePicker } from "@serea/ui/date-time-picker";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@serea/ui/dropdown-menu";
import { CalendarPlus2Icon } from "lucide-react";
import * as React from "react";

type WatchEventPopoverProps = {
	entry: RouterOutputs["watchlist"]["getEntries"]["entries"][number];
};

export default function WatchEventPopover({ entry }: WatchEventPopoverProps) {
	const [date, setDate] = React.useState<Date | undefined>(undefined);

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<CalendarPlus2Icon />
				<span>Create new watch party</span>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="p-2">
				<div className="flex flex-col min-w-[300px] gap-2">
					<DateTimePicker
						granularity="minute"
						hourCycle={24}
						value={date}
						onChange={setDate}
					/>
					<Button disabled={typeof date === "undefined"} className="w-full">
						Create watch party
					</Button>
				</div>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
