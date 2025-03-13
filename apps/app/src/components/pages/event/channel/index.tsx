"use client";

import { ListIcon } from "lucide-react";
import { useChannelParticipation } from "~/lib/hooks/channel";
import Chat from "./chat";

export default function EventChannel({
	channelId,
	eventId,
	watchlistId,
	currentUserId,
}: {
	channelId: string;
	eventId: string;
	watchlistId: string;
	currentUserId: string;
}) {
	const { participants } = useChannelParticipation(channelId);

	return (
		<div className="h-full py-6">
			<div className="flex px-8 items-center border-b gap-2 pb-6 text-carbon-900">
				<ListIcon className="w-4 h-4" />
				<p className="font-mono text-xs">CHAT</p>
			</div>
			<Chat channelId={channelId} currentUserId={currentUserId} />
		</div>
	);
}
