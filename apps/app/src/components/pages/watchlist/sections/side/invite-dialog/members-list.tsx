import type { RouterOutputs } from "@serea/api";
import { Avatar } from "@serea/ui/avatar";

export default function MembersList({
	members,
}: {
	members: RouterOutputs["watchlist"]["getMembers"];
}) {
	return (
		<div>
			<h1 className="my-2 font-medium">Members</h1>
			<div className="flex flex-col gap-2">
				{members.map((member) => (
					<MemberRow key={member.id} member={member} />
				))}
			</div>
		</div>
	);
}

function MemberRow({
	member,
}: { member: RouterOutputs["watchlist"]["getMembers"][number] }) {
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
		</div>
	);
}
