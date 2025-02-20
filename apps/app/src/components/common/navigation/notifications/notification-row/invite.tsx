import type { RouterOutputs } from "@serea/api";

export default function NotificationWatchlistInvite({
	notification,
}: {
	notification: RouterOutputs["notification"]["getNotifications"][number];
}) {
	return <div>Watchlist Invite</div>;
}
