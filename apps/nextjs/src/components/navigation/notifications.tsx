import { Button } from "@serea/ui/button";
import {
	TooltipRoot,
	TooltipTrigger,
	TooltipPortal,
	TooltipContent,
	TooltipArrow,
	TooltipProvider,
} from "@serea/ui/tooltip";
import { Bell } from "lucide-react";
import { Suspense } from "react";

export default function Notifications() {
	return (
		<Suspense fallback={<p>1</p>}>
			<TooltipProvider>
				<TooltipRoot>
					<TooltipTrigger>
						<Button
							size={"xs-icon"}
							variant={"transparent"}
							className="text-neutral-500 h-9 w-9 hover:border-[1px] border-surface-100"
						>
							<Bell size={18} className="stroke-[2px]" />
						</Button>
					</TooltipTrigger>
					<TooltipPortal>
						<TooltipContent side="right" content="" arrow>
							<p>Notifications</p>
							<TooltipArrow />
						</TooltipContent>
					</TooltipPortal>
				</TooltipRoot>
			</TooltipProvider>
		</Suspense>
	);
}
