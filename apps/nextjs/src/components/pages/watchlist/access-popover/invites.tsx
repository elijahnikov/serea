import type { RouterOutputs } from "@serea/api";
import { AvatarWedges } from "@serea/ui/avatar";
import { Button } from "@serea/ui/button";
import Loading from "@serea/ui/loading";
import { Trash } from "lucide-react";

export default function Invites({
	invites,
	isLoading,
}: {
	invites: RouterOutputs["members"]["listInvites"] | undefined;
	isLoading: boolean;
}) {
	if (!invites || invites.length === 0) return null;
	return (
		<div className="gap-2 flex flex-col">
			<p className="text-sm font-medium">Invites</p>
			<div className="w-full flex">
				{isLoading ? (
					<Loading type="spinner" size="xs" color="secondary" />
				) : null}
				{!isLoading ? (
					<div className="w-full">
						{invites.map((invite) => (
							<InviteRow key={invite.id} invite={invite} />
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}

const InviteRow = ({
	invite,
}: { invite: RouterOutputs["members"]["listInvites"][number] }) => {
	return (
		<div className="flex items-center gap-2 w-full">
			<AvatarWedges
				src={invite.invitee.image ?? undefined}
				alt={`Profile picture for ${invite.invitee.name}`}
			/>
			<div className="flex items-center w-full justify-between">
				<div className="flex mt-1 flex-col">
					<p className="text-md font-medium leading-none">
						{invite.invitee.name}
					</p>
					<p className="text-sm text-secondary-500">{invite.invitee.email}</p>
				</div>
				<Button
					className="rounded-full h-10 w-10"
					variant={"outline"}
					size="xs-icon"
				>
					<Trash size={16} />
				</Button>
			</div>
		</div>
	);
};
