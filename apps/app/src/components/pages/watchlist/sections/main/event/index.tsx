import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import { CalendarIcon, XIcon } from "lucide-react";

const EVENT_COLORS = {
	LIVE: "from-green-300 to-green-100",
	UPCOMING: "from-blue-300 to-blue-100",
	PAST: "from-red-300 to-red-100",
};

export default function EventSection() {
	return (
		<div
			className={cn(
				"pl-8 pr-8 border-b flex py-6 bg-gradient-to-r",
				EVENT_COLORS["LIVE" as keyof typeof EVENT_COLORS],
			)}
		>
			<div className="flex items-center justify-between w-full">
				<div className="flex flex-col gap-2">
					<div className="flex items-center w-full justify-between text-carbon-dark-500">
						<div className="flex items-center gap-2">
							<CalendarIcon className="w-4 h-4" />
							<p className="font-mono text-xs">EVENTS</p>
						</div>
					</div>
					<p className="font-medium text-carbon-dark-100">
						Watch event set for 12th March 2025 for{" "}
						<span className="font-bold">The Dark Knight</span>
					</p>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<Button variant={"outline"} size={"sm"}>
					Join
				</Button>
				<Button isIconOnly variant={"secondary"} size={"sm"}>
					<XIcon className="w-4 h-4" />
				</Button>
			</div>
		</div>
	);
}
