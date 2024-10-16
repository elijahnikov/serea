import type { RouterInputs, RouterOutputs } from "@serea/api";
import { AvatarFallback, AvatarImage, AvatarRoot } from "@serea/ui/avatar";
import Badge from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import { Trash } from "lucide-react";

export default function Invites({
	invites,
	deleteInvite,
}: {
	invites: RouterOutputs["members"]["listInvites"];
	deleteInvite: (input: RouterInputs["members"]["deleteInvite"]) => void;
}) {
	return (
		<div className="flex flex-col">
			<p className="text-[14px] font-medium text-neutral-500">Invites</p>
			<div className="mt-2 space-y-3">
				{invites?.map((invite) => (
					<div className="w-full flex space-x-2 items-center" key={invite.id}>
						<AvatarRoot>
							<AvatarImage
								src={invite.invitee.image ?? undefined}
								alt={`Navigation profile picture for ${invite.invitee.name}`}
							/>
							<AvatarFallback>
								{invite.invitee.name?.charAt(0).toLocaleUpperCase()}
							</AvatarFallback>
						</AvatarRoot>
						<div className="flex w-full justify-between items-center">
							<div className="flex items-center space-x-2">
								<p className="text-[16px] leading-4 font-medium text-neutral-700">
									{invite.invitee.name}
								</p>
								<Badge
									shape="pill"
									stroke
									className="text-xs font-medium"
									color="yellow"
								>
									<p>Pending</p>
								</Badge>
							</div>
							<div>
								<Button
									onClick={() => deleteInvite({ invitationId: invite.id })}
									size={"xs-icon"}
									variant={"outline"}
									className="w-8"
								>
									<Trash size={16} className="text-neutral-600" />
								</Button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
