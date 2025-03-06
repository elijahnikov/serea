import { useLivePosts } from "~/lib/hooks/channel";

export default function WatchEventChat({
	channelId,
}: {
	channelId: string;
}) {
	const livePosts = useLivePosts(channelId);
	return <div>1</div>;
}
