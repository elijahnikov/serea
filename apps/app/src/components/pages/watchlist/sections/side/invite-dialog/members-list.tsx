import type { RouterOutputs } from "@serea/api";
import { Role } from "@serea/db";
import { Avatar } from "@serea/ui/avatar";
import { Button } from "@serea/ui/button";
import { LoadingButton } from "@serea/ui/loading-button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@serea/ui/select";
import { XIcon } from "lucide-react";
import { api } from "~/trpc/react";

export default function MembersList({
	members,
	watchlistId,
}: {
	members: RouterOutputs["watchlist"]["getMembers"];
	watchlistId: string;
}) {
	const utils = api.useUtils();
	const updateRole = api.watchlist.updateMemberRole.useMutation({
		onSuccess: () => {
			void utils.watchlist.getMembers.invalidate({ id: watchlistId });
		},
	});
	const deleteMember = api.watchlist.deleteMember.useMutation({
		onSuccess: () => {
			void utils.watchlist.getMembers.invalidate({ id: watchlistId });
		},
	});

	return (
		<div>
			<h1 className="my-2 font-medium">Members</h1>
			<div className="flex flex-col gap-4">
				{members.map((member) => (
					<MemberRow
						updateRole={(memberId, role) =>
							updateRole.mutate({ memberId, watchlistId, role })
						}
						deleteMember={(memberId) =>
							deleteMember.mutate({ memberId, watchlistId })
						}
						key={member.id}
						member={member}
						deleteMemberLoading={
							deleteMember.isPending &&
							deleteMember.variables?.memberId === member.id
						}
					/>
				))}
			</div>
		</div>
	);
}

function MemberRow({
	member,
	updateRole,
	deleteMember,
	deleteMemberLoading,
}: {
	member: RouterOutputs["watchlist"]["getMembers"][number];
	updateRole: (memberId: string, role: "EDITOR" | "VIEWER") => void;
	deleteMember: (memberId: string) => void;
	deleteMemberLoading: boolean;
}) {
	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center gap-2">
				<Avatar
					size="sm"
					src={member.user.image ?? undefined}
					className="h-8 w-8"
					initials={member.user.name?.slice(0, 2)}
				/>
				<div className="flex flex-col">
					<p className="text-sm leading-tight font-medium">
						{member.user.name}
					</p>
					<p className="text-xs leading-tight text-carbon-900 font-medium">
						{member.user.email}
					</p>
				</div>
			</div>
			{member.role !== "OWNER" && (
				<div className="flex items-center gap-2">
					<Select
						value={member.role}
						onValueChange={(value) =>
							updateRole(member.id, value as "EDITOR" | "VIEWER")
						}
					>
						<SelectTrigger className="min-w-[100px]">
							<SelectValue placeholder="Select role" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="VIEWER">Viewer</SelectItem>
							<SelectItem value="EDITOR">Editor</SelectItem>
						</SelectContent>
					</Select>
					<LoadingButton
						loading={deleteMemberLoading}
						onClick={() => deleteMember(member.id)}
						variant="outline"
						className="px-1"
					>
						<XIcon className="w-4 h-4" />
					</LoadingButton>
				</div>
			)}
		</div>
	);
}
