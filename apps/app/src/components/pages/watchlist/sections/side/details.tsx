import type { RouterOutputs } from "@serea/api";
import { Avatar } from "@serea/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function WatchlistDetails({
	details,
}: {
	details: Pick<
		RouterOutputs["watchlist"]["get"],
		"createdAt" | "user" | "updatedAt"
	>;
}) {
	return (
		<div>
			<p className="text-xs font-mono text-carbon-900">CREATED BY</p>
			<div className="flex items-center gap-2 mt-2">
				<Avatar
					size={"sm"}
					src={details.user.image ?? undefined}
					initials={details.user.name?.slice(0, 2)}
				/>
				<p className="text-md font-medium">{details.user.name}</p>
			</div>
			<TooltipProvider>
				<div className="flex items-center gap-2 mt-2">
					<p className="text-xs font-mono text-carbon-900">CREATED</p>
					<Tooltip>
						<TooltipTrigger>
							<p className="text-xs">{dayjs(details.createdAt).fromNow()}</p>
						</TooltipTrigger>
						<TooltipContent>
							<p>{dayjs(details.createdAt).format("DD MMMM YYYY")}</p>
						</TooltipContent>
					</Tooltip>
				</div>
				<div className="flex items-center gap-2 mt-2">
					<p className="text-xs font-mono text-carbon-900">LAST UPDATED</p>
					<Tooltip>
						<TooltipTrigger>
							<p className="text-xs">{dayjs(details.updatedAt).fromNow()}</p>
						</TooltipTrigger>
						<TooltipContent>
							<p>{dayjs(details.updatedAt).format("DD MMMM YYYY")}</p>
						</TooltipContent>
					</Tooltip>
				</div>
			</TooltipProvider>
		</div>
	);
}
