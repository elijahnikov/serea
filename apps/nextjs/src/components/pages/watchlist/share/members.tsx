import type { RouterInputs, RouterOutputs } from "@serea/api";
import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import { Button } from "@serea/ui/button";
import { LoadingButton } from "@serea/ui/loading-button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from "@serea/ui/select";
import { Trash } from "lucide-react";
import { api } from "~/trpc/react";

export default function Members({
	members,
	isOwner,
	watchlistId,
}: {
	members: RouterOutputs["members"]["listMembers"];
	isOwner: boolean;
	watchlistId: string;
}) {
	const utils = api.useUtils();

	const { mutate: deleteMember, isPending: isDeletingMember } =
		api.members.deleteMember.useMutation({
			onSuccess: () => {
				utils.members.listMembers.invalidate({ watchlistId });
			},
		});
	const { mutate: updateRole, isPending: isUpdatingRole } =
		api.members.updateRole.useMutation({
			onSuccess: () => {
				utils.members.listMembers.invalidate({ watchlistId });
			},
		});
	return (
		<div className="flex flex-col">
			<p className="text-[14px] font-medium text-neutral-500">Members</p>
			<div className="mt-2 space-y-2">
				{members?.map((member) => (
					<div
						className="w-full flex space-x-2 justify-between items-center"
						key={member.id}
					>
						<div className="flex items-center">
							<AvatarRoot>
								<AvatarWedges
									size="sm"
									src={member.user.image ?? undefined}
									alt={`Navigation profile picture for ${member.user.name}`}
								/>
							</AvatarRoot>
							<div className="flex flex-col">
								<div>
									<p className="text-[14px] leading-tight font-medium text-neutral-700">
										{member.user.name}
									</p>
								</div>
								<span className="text-xs leading-tight text-neutral-500">
									{member.role.charAt(0).toUpperCase() + member.role.slice(1)}
								</span>
							</div>
						</div>
						{isOwner && member.role !== "owner" && (
							<div className="flex space-x-2 items-center">
								<Select
									onValueChange={(value) =>
										updateRole({
											watchlistId,
											memberId: member.user.id,
											role: value as "editor" | "viewer",
										})
									}
									defaultValue={member.role}
								>
									<SelectTrigger
										className="h-8 rounded-full"
										disabled={isUpdatingRole}
									/>
									<SelectContent>
										<SelectGroup>
											<SelectItem value="viewer">View</SelectItem>
											<SelectItem value="editor">Edit</SelectItem>
										</SelectGroup>
									</SelectContent>
								</Select>
								<LoadingButton
									spinnerSize="xs"
									loading={isDeletingMember}
									onClick={() =>
										deleteMember({ watchlistId, memberId: member.user.id })
									}
									size="xs-icon"
									variant="outline"
									className="w-8 h-8 rounded-full"
								>
									<Trash size={16} className="stroke-red-600" />
								</LoadingButton>
							</div>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
