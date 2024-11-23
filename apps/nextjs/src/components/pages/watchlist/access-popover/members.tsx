import type { RouterOutputs } from "@serea/api";
import { AvatarWedges } from "@serea/ui/avatar";
import Badge from "@serea/ui/badge";
import Loading from "@serea/ui/loading";

export default function Members({
	members,
	isLoading,
}: {
	members: RouterOutputs["members"]["listMembers"] | undefined;
	isLoading: boolean;
}) {
	return (
		<div className="gap-2 flex flex-col">
			<p className="text-sm font-medium">Members</p>
			<div className="w-full flex">
				{isLoading ? (
					<Loading type="spinner" size="xs" color="secondary" />
				) : null}
				{!isLoading && members && members.length > 0 ? (
					<div className="w-full">
						{members.map((member) => (
							<MemberRow key={member.id} member={member} />
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
}: { member: RouterOutputs["members"]["listMembers"][number] }) => {
	return (
		<div className="flex items-center gap-2 w-full">
			<AvatarWedges
				src={member.user.image ?? undefined}
				alt={`Profile picture for ${member.user.name}`}
			/>
			<div className="flex items-center gap-1 w-full justify-between">
				<div className="flex mt-1 flex-col">
					<p className="text-md font-medium leading-none">{member.user.name}</p>
					<p className="text-sm text-secondary-500">{member.user.email}</p>
				</div>
				{member.role === "owner" ? (
					<Badge stroke className="text-xs text-secondary-500">
						Owner
					</Badge>
				) : null}
			</div>
		</div>
	);
};
