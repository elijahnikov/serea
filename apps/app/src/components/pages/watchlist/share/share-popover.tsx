"use client";

import { Button } from "@serea/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { useState } from "react";
import InviteForm from "./invite-form";
import Invites from "./invites";
import Members from "./members";
import { Plus, UserPlus } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { deleteInviteAction } from "~/actions/members/delete-invite";
import type { ListMembersReturnType } from "~/queries/members/list-members";
import type { ListInvitesReturnType } from "~/queries/members/list-invites";

export default function sSharePopover({
	watchlistId,
	isOwner,
	members,
	invites,
}: {
	watchlistId: string;
	isOwner: boolean;
	members: ListMembersReturnType;
	invites: ListInvitesReturnType;
}) {
	const [open, setOpen] = useState<boolean>(false);

	const deleteInvite = useAction(deleteInviteAction);
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
					<Invites deleteInvite={deleteInvite.execute} invites={invites} />
				)}
			</PopoverContent>
		</Popover>
	);
}
