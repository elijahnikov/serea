"use client";
import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { Plus } from "lucide-react";
import { api } from "~/trpc/react";
import InviteForm from "./invite-form";
import Invites from "./invites";
import Members from "./members";

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
				staleTime: Number.POSITIVE_INFINITY,
			},
		);

	const { data: members, isLoading: membersLoading } =
		api.members.listMembers.useQuery(
			{
				watchlistId,
			},
			{
				initialData: initialMembers ?? undefined,
				staleTime: Number.POSITIVE_INFINITY,
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
					<Members
						members={members}
						isLoading={membersLoading}
						watchlistId={watchlistId}
					/>
					<Invites invites={invites} isLoading={invitesLoading} />
				</div>
			</PopoverContent>
		</Popover>
	);
}
