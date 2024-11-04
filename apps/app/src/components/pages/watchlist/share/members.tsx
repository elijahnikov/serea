"use client";

import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import { LoadingButton } from "@serea/ui/loading-button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from "@serea/ui/select";
import { Trash } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteMemberAction } from "~/actions/members/delete-member";
import { updateRoleAction } from "~/actions/members/update-role";
import type { ListMembersReturnType } from "~/queries/members/list-members";

export default function Members({
	members,
	isOwner,
	watchlistId,
}: {
	members: ListMembersReturnType;
	isOwner: boolean;
	watchlistId: string;
}) {
	const deleteMember = useAction(deleteMemberAction);
	const updateRole = useAction(updateRoleAction);

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
									initials={member.user.name?.charAt(0)}
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
										updateRole.execute({
											watchlistId,
											memberId: member.user.id,
											role: value as "editor" | "viewer",
										})
									}
									defaultValue={member.role}
								>
									<SelectTrigger
										className="h-8 rounded-full"
										disabled={updateRole.isPending}
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
									loading={deleteMember.isPending}
									onClick={() =>
										deleteMember.execute({
											watchlistId,
											memberId: member.user.id,
										})
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
