import { cn } from "@serea/ui/cn";
import { useLivePosts } from "~/lib/hooks/channel";
import { useChannelStore } from "~/stores/channel";
import WatchEventChat from "./chat";

export default function WatchEventChannel() {
	const channelStore = useChannelStore();
	const currentChannelId = channelStore.currentChannelId;

	if (!currentChannelId) {
		return null;
	}

	return (
		<div
			className={cn(
				"fixed bg-transparent overflow-y-auto overflow-x-hidden max-h-screen space-y-8 px-6 right-0 min-h-screen max-w-[240px] min-w-[240px] border-l",
				"animate-slide-in-from-right transition-all duration-300 ease-in-out",
			)}
		>
			<WatchEventChat channelId={currentChannelId} />
		</div>
	);
}
