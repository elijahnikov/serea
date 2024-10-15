import type { RouterOutputs } from "@serea/api";
import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";

export default function Members({
	members,
	currentUserId,
}: {
	members: RouterOutputs["members"]["listMembers"];
	currentUserId: string | undefined;
}) {
	return (
		<div className="flex flex-col">
			<p className="text-[14px] font-medium text-neutral-500">Members</p>
			<div className="mt-2 space-y-3">
				{members?.map((member) => (
					<div className="w-full flex space-x-2 items-center" key={member.id}>
						<AvatarRoot>
							<AvatarWedges
								size="md"
								src={member.user.image ?? undefined}
								alt={`Navigation profile picture for ${member.user.name}`}
							/>
						</AvatarRoot>
						<div className="flex flex-col">
							<div>
								<p className="text-[16px] leading-4 font-medium text-neutral-700">
									{member.user.name}
								</p>
							</div>
							<p className="leading-tight text-xs text-neutral-500">
								{currentUserId === member.user.id && "This is you"}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
