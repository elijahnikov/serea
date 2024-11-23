"use client";
import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import Loading from "@serea/ui/loading";
import {
	Popover,
	PopoverArrow,
	PopoverContent,
	PopoverTrigger,
} from "@serea/ui/popover";
import { Plus, UserPlus } from "lucide-react";
import { api } from "~/trpc/react";
import Members from "./members";
import Invites from "./invites";
import InviteForm from "./invite-form";
import { cn } from "@serea/ui/cn";

export default function AccessPopover({
	initialMembers,
	initialInvites,
	watchlistId,
}: {
	initialMembers: RouterOutputs["members"]["listMembers"] | null;
	initialInvites: RouterOutputs["members"]["listInvites"] | null;
	watchlistId: string;
}) {
	const { data: invites, isLoading: invitesLoading } =
		api.members.listInvites.useQuery(
			{
				watchlistId,
			},
			{
				initialData: initialInvites ?? undefined,
			},
		);

	const { data: members, isLoading: membersLoading } =
		api.members.listMembers.useQuery(
			{
				watchlistId,
			},
			{
				initialData: initialMembers ?? undefined,
			},
		);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size={"xs-icon"} variant={"outline"}>
					<div className="flex items-center space-x-1">
						<Plus size={16} />
						<p>Invite</p>
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="focus:outline-none min-w-[400px] focus:ring-0">
				<div className="flex flex-col mb-2 gap-4">
					<h1 className="text-xl font-medium">Invite</h1>
					<InviteForm watchlistId={watchlistId} />
					<Members members={members} isLoading={membersLoading} />
					<Invites invites={invites} isLoading={invitesLoading} />
				</div>
			</PopoverContent>
		</Popover>
	);
}
