import type { RouterOutputs } from "@serea/api";
import { AvatarWedges } from "@serea/ui/avatar";
import Badge from "@serea/ui/badge";
import Loading from "@serea/ui/loading";
import { LoadingButton } from "@serea/ui/loading-button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from "@serea/ui/select";
import { Trash } from "lucide-react";
import { useMemo } from "react";
import { api } from "~/trpc/react";

export default function Members({
	members,
	isLoading,
	watchlistId,
}: {
	members: RouterOutputs["members"]["listMembers"] | undefined;
	isLoading: boolean;
	watchlistId: string;
}) {
	const trpcUtils = api.useUtils();
	const updateRole = api.members.updateRole.useMutation({
		onSuccess: () => trpcUtils.members.listMembers.invalidate(),
	});
	const deleteMember = api.members.deleteMember.useMutation({
		onSuccess: () => trpcUtils.members.listMembers.invalidate(),
	});

	const handleUpdateRole = (memberId: string, role: "editor" | "viewer") => {
		updateRole.mutate({ watchlistId, memberId, role });
	};

	const handleDeleteMember = (memberId: string) => {
		deleteMember.mutate({ watchlistId, memberId });
	};

	const sortedMembers = useMemo(() => {
		return members?.sort((a, b) => {
			const roleOrder = { owner: 0, editor: 1, viewer: 2 };
			return (
				(roleOrder[a.role as keyof typeof roleOrder] ?? 3) -
				(roleOrder[b.role as keyof typeof roleOrder] ?? 3)
			);
		});
	}, [members]);

	return (
		<div className="gap-2 flex flex-col">
			<p className="text-sm font-medium">Members</p>
			<div className="w-full flex">
				{isLoading ? (
					<Loading type="spinner" size="xs" color="secondary" />
				) : null}
				{!isLoading && members && members.length > 0 ? (
					<div className="w-full flex flex-col gap-4">
						{sortedMembers?.map((member) => (
							<MemberRow
								key={member.id}
								member={member}
								handleUpdateRole={handleUpdateRole}
								isUpdatingRole={updateRole.isPending}
								handleDeleteMember={handleDeleteMember}
								isDeletingMember={deleteMember.isPending}
							/>
						))}
					</div>
				) : (
					<p>No members</p>
				)}
			</div>
		</div>
	);
}

const MemberRow = ({
	member,
	handleUpdateRole,
	handleDeleteMember,
	isUpdatingRole,
	isDeletingMember,
}: {
	member: RouterOutputs["members"]["listMembers"][number];
	handleUpdateRole: (memberId: string, role: "editor" | "viewer") => void;
	isUpdatingRole: boolean;
	handleDeleteMember: (memberId: string) => void;
	isDeletingMember: boolean;
}) => {
	return (
		<div className="flex items-center gap-2 w-full">
			<AvatarWedges
				src={member.user.image ?? undefined}
				alt={`Profile picture for ${member.user.name}`}
			/>
			<div className="flex items-center gap-1 w-full justify-between">
				<div className="flex flex-col">
					<p className="text-md font-medium leading-none">{member.user.name}</p>
					<p className="text-sm text-secondary-500">{member.user.email}</p>
				</div>
				{member.role === "owner" ? (
					<Badge stroke className="text-xs text-secondary-500">
						Owner
					</Badge>
				) : (
					<div className="flex items-center gap-2">
						<Select
							onValueChange={(value) =>
								handleUpdateRole(member.id, value as "editor" | "viewer")
							}
							defaultValue={member.role}
						>
							<SelectTrigger
								className="h-8 flex justify-center items-center min-w-24"
								disabled={isUpdatingRole}
							>
								{isUpdatingRole ? (
									<Loading type="spinner" size="xxs" color="secondary" />
								) : null}
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="viewer">View</SelectItem>
									<SelectItem value="editor">Edit</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
						<LoadingButton
							className="rounded-full h-8 w-8 border border-surface"
							variant="outline"
							spinnerSize="xxs"
							loading={isDeletingMember}
							onClick={() => handleDeleteMember(member.userId)}
						>
							<Trash className="w-4 h-4" />
						</LoadingButton>
					</div>
				)}
			</div>
		</div>
	);
};
