import type { RouterOutputs } from "@serea/api";
import { AvatarWedges } from "@serea/ui/avatar";
import { Button } from "@serea/ui/button";
import Loading from "@serea/ui/loading";
import { LoadingButton } from "@serea/ui/loading-button";
import { Trash } from "lucide-react";
import { api } from "~/trpc/react";

export default function Invites({
	invites,
	isLoading,
}: {
	invites: RouterOutputs["members"]["listInvites"] | undefined;
	isLoading: boolean;
}) {
	const trpcUtils = api.useUtils();
	const deleteInvite = api.members.deleteInvite.useMutation({
		onSuccess: () => trpcUtils.members.listInvites.invalidate(),
	});

	const handleDeleteInvite = (inviteId: string) => {
		deleteInvite.mutate({ invitationId: inviteId });
	};

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
							<InviteRow
								key={invite.id}
								invite={invite}
								handleDeleteInvite={handleDeleteInvite}
								isDeletingInvite={deleteInvite.isPending}
							/>
						))}
					</div>
				) : null}
			</div>
		</div>
	);
}

const InviteRow = ({
	invite,
	handleDeleteInvite,
	isDeletingInvite,
}: {
	invite: RouterOutputs["members"]["listInvites"][number];
	handleDeleteInvite: (inviteId: string) => void;
	isDeletingInvite: boolean;
}) => {
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
				<LoadingButton
					className="rounded-full h-8 w-8"
					variant={"outline"}
					spinnerSize="xxs"
					loading={isDeletingInvite}
					onClick={() => handleDeleteInvite(invite.id)}
				>
					<Trash size={16} />
				</LoadingButton>
			</div>
		</div>
	);
};
