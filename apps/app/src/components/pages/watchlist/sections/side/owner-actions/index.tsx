import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";
import { PencilIcon, SettingsIcon, TrashIcon } from "lucide-react";
import { DeleteDialog } from "./delete-dialog";
import EditModal from "./edit-modal";
import InviteDialog from "./invite-dialog";

export default function OwnerActions({
	members,
	watchlist,
}: {
	members: RouterOutputs["watchlist"]["getMembers"];
	watchlist: RouterOutputs["watchlist"]["get"];
}) {
	return (
		<div className="mt-auto sticky z-50 pt-6 top-0 border-b px-8 pb-6 -ml-8 -mr-10 justify-end items-end self-end">
			<div className="flex items-center gap-2">
				<InviteDialog members={members} watchlistId={watchlist.id} />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button isIconOnly variant="outline">
							<SettingsIcon />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuGroup>
							<EditModal watchlist={watchlist} />
							<DeleteDialog watchlistId={watchlist.id} />
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	);
}
