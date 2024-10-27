import { api } from "~/trpc/react";
import Badge from "@serea/ui/badge";
import { Crown } from "lucide-react";
import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import ProgressCircle from "./progress-circle";
import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";

export default function MembersProgress({
	watchlistId,
}: { watchlistId: string }) {
	const [{ members, entriesLength }] =
		api.watched.getWatchlistProgress.useSuspenseQuery({
			watchlistId,
		});
	const sortedMembers = [...members].sort((a, b) => {
		const roleOrder = { owner: 0, editor: 1, viewer: 2 };
		return (
			roleOrder[a.role as keyof typeof roleOrder] -
			roleOrder[b.role as keyof typeof roleOrder]
		);
	});

	return (
		<div>
			<div className="flex items-center mb-2">
				<p className="font-medium text-neutral-600 text-sm">Members</p>
				<Badge className="ml-2 text-xs bg-surface-400 border font-medium text-neutral-600 border-surface-100">
					{sortedMembers.length}
				</Badge>
			</div>
			<TooltipProvider>
				<div className="space-y-2">
					{sortedMembers.map((member) => (
						<div key={member.id}>
							<div className="flex items-center gap-2">
								<TooltipRoot>
									<TooltipTrigger asChild>
										<div className="relative">
											<ProgressCircle
												progress={member.watched.length}
												total={entriesLength}
											/>
											<div className="absolute inset-0 flex items-center justify-center">
												<AvatarRoot>
													<AvatarWedges
														size="md"
														src={member.user.image ?? undefined}
														alt={`Profile picture for ${member.user.name}`}
														initials={member.user.name?.charAt(0)}
													/>
												</AvatarRoot>
											</div>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										{member.watched.length} / {entriesLength} watched
									</TooltipContent>
								</TooltipRoot>
								<div className="flex items-center space-x-1">
									<h3 className="text-md font-medium">{member.user.name}</h3>
									{member.role === "owner" && (
										<Crown
											className="fill-neutral-600 text-neutral-600"
											size={14}
										/>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</TooltipProvider>
		</div>
	);
}
