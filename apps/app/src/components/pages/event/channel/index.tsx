"use client";

import { MessageSquareIcon } from "lucide-react";
import * as React from "react";
import { useJoinedChannel } from "~/lib/hooks/channel";
import Chat from "./chat";
import Participants from "./participants";

export default function EventChannel({
	channelId,
	currentUserId,
}: {
	channelId: string;
	currentUserId: string;
}) {
	const setJoined = useJoinedChannel(channelId);

	React.useEffect(() => {
		setJoined(true);

		return () => {
			setJoined(false);
		};
	}, [setJoined]);
	return (
		<div className="h-full py-6">
			<div className="flex px-8 items-center border-b gap-2 pb-6 text-carbon-900">
				<MessageSquareIcon className="w-4 h-4" />
				<p className="font-mono text-xs">CHAT</p>
				<Participants channelId={channelId} />
			</div>
			<Chat channelId={channelId} currentUserId={currentUserId} />
		</div>
	);
}
