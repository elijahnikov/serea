import type { RouterOutputs } from "@serea/api";

export default function NotificationWatchlistLike({
	notification,
}: {
	notification: RouterOutputs["notification"]["getNotifications"][number];
}) {
	return <div>NotificationWatchlistLike</div>;
}
