import { AvatarGroupItem, AvatarGroupRoot } from "@serea/ui/avatar-group";
import Badge from "@serea/ui/badge";
import {
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
	TooltipPortal,
	TooltipContent,
	TooltipArrow,
} from "@serea/ui/tooltip";
import { Crown } from "lucide-react";
import { api } from "~/trpc/react";

export default function MemberList({ watchlistId }: { watchlistId: string }) {
	const [members] = api.members.listMembers.useSuspenseQuery({ watchlistId });
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
					{members.length}
				</Badge>
			</div>
			<div className="flex flex-wrap gap-2">
				<TooltipProvider>
					<AvatarGroupRoot>
						{sortedMembers.map((member) => (
							<TooltipRoot key={member.id}>
								<TooltipTrigger asChild>
									<AvatarGroupItem
										size="lg"
										initials={member.user.name?.charAt(0)}
										src={member.user.image ?? undefined}
										alt={member.user.name ?? undefined}
									/>
								</TooltipTrigger>
								<TooltipPortal>
									<TooltipContent
										content=""
										arrow
										className="flex items-center space-x-1"
									>
										<p>{member.user.name}</p>
										{member.role === "owner" && <Crown size={14} />}
										<TooltipArrow />
									</TooltipContent>
								</TooltipPortal>
							</TooltipRoot>
						))}
					</AvatarGroupRoot>
				</TooltipProvider>
			</div>
		</div>
	);
}
