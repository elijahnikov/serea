import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@serea/ui/dialog";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import { api } from "~/trpc/react";
import InviteForm from "./invite-form";
import InviteList from "./invite-list";
import MembersList from "./members-list";

export default function InviteDialog({
	members,
	watchlistId,
}: {
	members: RouterOutputs["watchlist"]["getMembers"];
	watchlistId: string;
}) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button before={<PlusIcon />} className="w-full">
					Invite members
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<div className="flex items-center gap-2">
						<div className="rounded-full border p-2 dark:shadow-sm-dark dark:bg-carbon-dark-100">
							<UserPlusIcon />
						</div>
						<div>
							<DialogTitle>Invite members</DialogTitle>
							<DialogDescription>
								Invite people and manage members of your watchlist
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>
				<InviteForm watchlistId={watchlistId} />
				<InviteList watchlistId={watchlistId} />
				<MembersList members={members} />
			</DialogContent>
		</Dialog>
	);
}
