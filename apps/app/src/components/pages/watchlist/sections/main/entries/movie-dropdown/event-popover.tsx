import { Button } from "@serea/ui/button";
import { DateTimePicker } from "@serea/ui/date-time-picker";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@serea/ui/dropdown-menu";
import { CalendarPlus2Icon } from "lucide-react";
import * as React from "react";

export default function WatchEventPopover() {
	const [date24, setDate24] = React.useState<Date | undefined>(undefined);

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
						value={date24}
						onChange={setDate24}
					/>
					<Button disabled={typeof date24 === "undefined"} className="w-full">
						Create watch party
					</Button>
				</div>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
