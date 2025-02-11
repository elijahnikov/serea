import type { RouterOutputs } from "@serea/api";
import { Avatar } from "@serea/ui/avatar";
import { Badge } from "@serea/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import _ from "lodash";
import { CrownIcon } from "lucide-react";
import * as React from "react";
import ProgressCircle from "./progress-circle";

export default function WatchlistMembers({
	members,
}: {
	members: Pick<RouterOutputs["watchlist"]["get"], "members" | "_count">;
}) {
	const sortedMembers = React.useMemo(() => {
		return [...members.members].sort((a, b) => {
			const roleOrder = { owner: 0, editor: 1, viewer: 2 };
			return (
				roleOrder[a.role as keyof typeof roleOrder] -
				roleOrder[b.role as keyof typeof roleOrder]
			);
		});
	}, [members.members]);
	return (
		<div>
			<p className="text-xs font-mono text-carbon-900">MEMBERS</p>
			<div className="flex mt-2 flex-col gap-2">
				<TooltipProvider>
					{sortedMembers.map((member) => (
						<div key={member.id} className="flex items-center gap-2">
							<div className="flex items-center gap-2">
								<Tooltip>
									<TooltipTrigger>
										<div className="relative">
											<ProgressCircle
												progress={member._count.watched}
												total={members._count.entries}
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
											{member._count.watched} / {members._count.entries}
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
	);
}
