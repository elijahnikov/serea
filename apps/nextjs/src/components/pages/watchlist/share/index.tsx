import { Button } from "@serea/ui/button";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
} from "@serea/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import InviteForm from "./invite-form";
import Members from "./members";
import Invites from "./invites";
import type { RouterOutputs } from "@serea/api";

export default function ShareWatchlist({
	watchlistId,
	owner,
	isOwner,
}: {
	watchlistId: string;
	owner: NonNullable<RouterOutputs["watchlist"]["get"]>["user"];
	isOwner: boolean;
}) {
	const [open, setOpen] = useState<boolean>(false);

	const utils = api.useUtils();

	const { data: members } = api.members.listMembers.useQuery({ watchlistId });
	const { data: invites } = api.members.listInvites.useQuery({ watchlistId });

	const { mutate: deleteInvite } = api.members.deleteInvite.useMutation({
		onSuccess: () => {
			utils.members.listInvites.invalidate({ watchlistId });
		},
	});

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={"xs-icon"} variant={"outline"}>
					<div className="flex items-center space-x-1">
						<Plus size={16} />
						<p>Invite</p>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent className="focus:outline-none focus:ring-0">
				<DialogHeader className="text-lg font-medium">
					Invite to watchlist
				</DialogHeader>
				<InviteForm watchlistId={watchlistId} />
				{members && (
					<Members
						watchlistId={watchlistId}
						isOwner={isOwner}
						members={members}
					/>
				)}
				{invites && invites.length > 0 && (
					<Invites deleteInvite={deleteInvite} invites={invites} />
				)}
			</DialogContent>
		</Dialog>
	);
}
