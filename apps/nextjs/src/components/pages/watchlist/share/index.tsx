import { Button } from "@serea/ui/button";
import { Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import InviteForm from "./invite-form";
import Members from "./members";
import Invites from "./invites";
import type { RouterOutputs } from "@serea/api";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";

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
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button size={"xs-icon"} variant={"tertiary"} className="border">
					<div className="flex items-center space-x-1">
						<Plus size={16} />
						<p>Invite</p>
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="focus:outline-none focus:ring-0">
				<div className="flex items-center mb-2 gap-2">
					<div className="shadow-wg-xs rounded-lg border p-2">
						<UserPlus size={14} className="text-neutral-500" />
					</div>
					<h1 className="text-[15px] font-medium">
						Invite people to watchlist
					</h1>
				</div>
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
			</PopoverContent>
		</Popover>
	);
}
