import type { RouterOutputs } from "@serea/api";

export default function NotificationWatchlistComment({
	notification,
}: {
	notification: RouterOutputs["notification"]["getNotifications"][number];
}) {
	return <div>NotificationWatchlistComment</div>;
}
