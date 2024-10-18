import {
	AvatarGroup,
	AvatarGroupItem,
	AvatarGroupRoot,
} from "@serea/ui/avatar-group";
import Badge from "@serea/ui/badge";
import {
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
	TooltipPortal,
	TooltipContent,
	TooltipArrow,
} from "@serea/ui/tooltip";
import { content } from "tailwindcss/defaultTheme";
import { api } from "~/trpc/react";

export default function MemberList({ watchlistId }: { watchlistId: string }) {
	const [members] = api.members.listMembers.useSuspenseQuery({ watchlistId });
	return (
		<div>
			<div className="flex items-center mb-2">
				<p className="font-medium text-neutral-600 text-sm">Members</p>
				<Badge className="ml-2 text-xs bg-surface-400">{members.length}</Badge>
			</div>
			<div className="flex flex-wrap gap-2">
				<TooltipProvider>
					<AvatarGroupRoot>
						{members.map((member) => (
							<TooltipRoot key={member.id}>
								<TooltipTrigger asChild>
									<AvatarGroupItem
										size="lg"
										src={member.user.image ?? undefined}
										alt={member.user.name ?? undefined}
									/>
								</TooltipTrigger>
								<TooltipPortal>
									<TooltipContent content="" arrow>
										{member.user.name}
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
