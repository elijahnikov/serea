import type { RouterOutputs } from "@serea/api";
import NotificationWatchlistComment from "./comment";
import NotificationWatchlistInvite from "./invite";
import NotificationWatchlistLike from "./like";

export default function NotificationRow({
	notification,
}: {
	notification: RouterOutputs["notification"]["getNotifications"][number];
}) {
	if (notification.type === "WATCHLIST_INVITE") {
		return <NotificationWatchlistInvite notification={notification} />;
	}
	if (notification.type === "WATCHLIST_COMMENT") {
		return <NotificationWatchlistComment notification={notification} />;
	}
	if (notification.type === "WATCHLIST_LIKE") {
		return <NotificationWatchlistLike notification={notification} />;
	}
	return null;
}
