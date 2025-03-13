import { AvatarGroup, AvatarGroupItem } from "@serea/ui/avatar-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import { useChannelParticipation } from "~/lib/hooks/channel";

export default function Participants({ channelId }: { channelId: string }) {
	const { participants, isLoading, shouldRender } =
		useChannelParticipation(channelId);

	if (!shouldRender || isLoading) return null;
	return (
		<div className="ml-auto text-xs items-center flex gap-2">
			<p className="font-mono text-xs text-carbon-900">ONLINE</p>
			<AvatarGroup size={"xs"}>
				<TooltipProvider>
					{participants.map((p) => (
						<Participant key={p.id} participant={p} />
					))}
				</TooltipProvider>
			</AvatarGroup>
		</div>
	);
}

type ChannelParticipant = {
	id: string;
	name: string;
	image: string | null | undefined;
};

function Participant({ participant }: { participant: ChannelParticipant }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<AvatarGroupItem
					size={"xs"}
					src={participant.image ?? undefined}
					initials={participant.name.slice(0, 2)}
				/>
			</TooltipTrigger>
			<TooltipContent>
				<p>{participant.name}</p>
			</TooltipContent>
		</Tooltip>
	);
}
