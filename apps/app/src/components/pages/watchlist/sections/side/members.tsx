import type { RouterOutputs } from "@serea/api";
import { Avatar } from "@serea/ui/avatar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import _ from "lodash";
import { CrownIcon } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { api } from "~/trpc/react";
import OwnerActions from "./owner-actions";
import ProgressCircle from "./progress-circle";

export default function WatchlistMembers({
	watchlist,
	totalEntries,
}: {
	watchlist: Pick<RouterOutputs["watchlist"]["get"], "isOwner" | "id">;
	totalEntries: number;
}) {
	const [members] = api.watchlist.getMembers.useSuspenseQuery({
		id: watchlist.id,
	});

	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<>
			<div>
				<p className="text-xs font-mono text-carbon-900">MEMBERS</p>
				<div className="flex mt-2 flex-col gap-2">
					<TooltipProvider>
						{members.map((member) => (
							<div key={member.id} className="flex items-center gap-2">
								<div className="flex items-center gap-2">
									<Tooltip>
										<TooltipTrigger>
											<div className="relative">
												<ProgressCircle
													progress={member._count.watched}
													total={totalEntries}
												/>
												<div className="absolute inset-0 flex items-center justify-center">
													<Avatar
														size="md"
														src={member.user.image ?? undefined}
														alt={`Profile picture for ${member.user.name}`}
														initials={member.user.name?.charAt(0)}
													/>
												</div>
											</div>
										</TooltipTrigger>
										<TooltipContent>
											<p className="text-xs font-mono">
												{member._count.watched} / {totalEntries}
											</p>
										</TooltipContent>
									</Tooltip>
									<p className="text-md font-medium">{member.user.name}</p>
								</div>
								{member.role === "OWNER" && (
									<CrownIcon className="h-4 w-4 text-muted-foreground" />
								)}
							</div>
						))}
					</TooltipProvider>
				</div>
			</div>
			{watchlist.isOwner && mounted ? (
				createPortal(
					<OwnerActions members={members} watchlistId={watchlist.id} />,
					document.getElementById("owner-actions-portal") ?? document.body,
				)
			) : (
				<div />
			)}
		</>
	);
}
