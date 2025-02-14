import type { RouterOutputs } from "@serea/api";
import { Avatar } from "@serea/ui/avatar";
import { Button } from "@serea/ui/button";
import { TrashIcon } from "lucide-react";
import { api } from "~/trpc/react";

export default function InviteList({ watchlistId }: { watchlistId: string }) {
	const utils = api.useUtils();
	const { data, isLoading } = api.watchlist.getInvites.useQuery({
		id: watchlistId,
	});
	const deleteInvite = api.watchlist.deleteInvite.useMutation();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (data?.length === 0) {
		return <div>No invites</div>;
	}

	return (
		<div>
			<h1 className="my-2 font-medium">Invites</h1>
			<div className="flex flex-col gap-2">
				{data?.map((invite) => (
					<InviteRow
						key={invite.id}
						invite={invite}
						deleteInvite={(inviteId) => deleteInvite.mutate({ inviteId })}
					/>
				))}
			</div>
		</div>
	);
}

function InviteRow({
	invite,
	deleteInvite,
}: {
	invite: RouterOutputs["watchlist"]["getInvites"][number];
	deleteInvite: (inviteId: string) => void;
}) {
	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center gap-2">
				<Avatar
					size="sm"
					src={invite.invitee.image ?? undefined}
					className="h-8 w-8"
					initials={invite.invitee.name?.slice(0, 2)}
				/>
				<div className="flex flex-col">
					<p className="text-sm leading-tight font-medium">
						{invite.invitee.name}
					</p>
					<p className="text-xs leading-tight text-carbon-900 font-medium">
						{invite.inviteeEmail}
					</p>
				</div>
			</div>
			<Button className="rounded-full" variant={"destructive"} isIconOnly>
				<TrashIcon />
			</Button>
		</div>
	);
}
