import type { RouterOutputs } from "@serea/api";
import { Avatar } from "@serea/ui/avatar";
import { Badge } from "@serea/ui/badge";
import _ from "lodash";

export default function WatchlistMembers({
	members,
}: {
	members: Pick<RouterOutputs["watchlist"]["get"], "members">;
}) {
	return (
		<div>
			<p className="text-xs font-mono text-carbon-900">MEMBERS</p>
			<div className="flex mt-2 flex-col gap-2">
				{members.members.map((member) => (
					<div
						key={member.id}
						className="flex items-center gap-2 justify-between"
					>
						<div className="flex items-center gap-2">
							<Avatar
								size="md"
								src={member.user.image ?? undefined}
								initials={member.user.name?.slice(0, 2)}
							/>
							<p className="text-md font-medium">{member.user.name}</p>
						</div>
						<Badge size="sm" className="border text-xs font-mono">
							{_.startCase(member.role.toLocaleLowerCase())}
						</Badge>
					</div>
				))}
			</div>
		</div>
	);
}
