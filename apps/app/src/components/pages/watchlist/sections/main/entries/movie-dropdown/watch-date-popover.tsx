"use client";

import { Button } from "@serea/ui/button";
import { Calendar } from "@serea/ui/calendar";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@serea/ui/dropdown-menu";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

export default function WatchDatePopover() {
	const [date, setDate] = React.useState<Date | undefined>(new Date());

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<CalendarIcon size={16} />
				<span>Set watch date</span>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="p-2">
				<Calendar
					mode="single"
					selected={date}
					onSelect={setDate}
					className="rounded-lg border"
				/>
				<div className="flex gap-2 items-center w-full mt-2">
					{/* <Button className="w-full" variant="outline">
						Cancel
					</Button> */}
					<Button className="w-full">Confirm</Button>
				</div>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
