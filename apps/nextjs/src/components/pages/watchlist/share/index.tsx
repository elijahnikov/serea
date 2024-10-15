import type { RouterOutputs } from "@serea/api";
import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import { Button } from "@serea/ui/button";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
} from "@serea/ui/dialog";
import Input from "@serea/ui/input";
import Loading from "@serea/ui/loading";
import { Share, Plus, Crown, Eye, Pencil } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import InviteForm from "./invite-form";
import Members from "./members";
import Invites from "./invites";

const roleMap = {
	owner: <Crown size={16} />,
	viewer: <Eye size={16} />,
	editor: <Pencil size={16} />,
};

export default function ShareWatchlist({
	watchlistId,
}: { watchlistId: string }) {
	const [open, setOpen] = useState<boolean>(false);

	const { data: session } = api.auth.getSession.useQuery();
	const { data: members, isLoading: isLoadingMembers } =
		api.members.listMembers.useQuery(
			{
				watchlistId,
			},
			{
				enabled: open,
			},
		);
	const { data: invites, isLoading: isLoadingInvites } =
		api.members.listInvites.useQuery(
			{
				watchlistId,
			},
			{
				enabled: open,
			},
		);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={"xs-icon"} variant={"outline"}>
					<div className="flex items-center space-x-1">
						<Share size={16} />
						<p>Share</p>
					</div>
				</Button>
			</DialogTrigger>
			<DialogContent className="focus:outline-none focus:ring-0">
				<DialogHeader className="text-lg font-medium">
					Share watchlist
				</DialogHeader>
				{isLoadingMembers && (
					<div className="w-full flex items-center justify-center h-24">
						<Loading type="spinner" color="secondary" size="sm" />
					</div>
				)}
				<InviteForm watchlistId={watchlistId} />
				{!isLoadingMembers && members && (
					<Members members={members} currentUserId={session?.user.id} />
				)}
				{!isLoadingInvites && invites && invites.length > 0 && (
					<Invites invites={invites} />
				)}
			</DialogContent>
		</Dialog>
	);
}
