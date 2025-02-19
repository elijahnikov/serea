import type { NotificationType } from "@serea/db";

type NotificationWithActor = {
	actor: {
		name: string | null;
		id: string;
		image: string | null;
	};
} & {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	type: NotificationType;
	actorId: string;
	read: boolean;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any;
};

function getGroupingKey(notification: NotificationWithActor): string | null {
	const data = notification.data as { watchlistId?: string } | null;

	switch (notification.type) {
		case "WATCHLIST_LIKE":
			return data?.watchlistId ? `LIKE:${data.watchlistId}` : null;
		case "WATCHLIST_COMMENT":
			return data?.watchlistId ? `COMMENT:${data.watchlistId}` : null;
		case "WATCHLIST_INVITE":
		case "FOLLOW":
			return null;
	}
}

function isWithinTimeframe(date1: Date, date2: Date, minutes: number): boolean {
	const diff = Math.abs(date1.getTime() - date2.getTime());
	return diff <= minutes * 60 * 1000;
}

export function collateNotifications(
	notifications: NotificationWithActor[],
): NotificationWithActor[] {
	const collatedNotifications = notifications.reduce((acc, notification) => {
		const key = getGroupingKey(notification);
		if (!key) {
			acc.push(notification);
			return acc;
		}

		const existing = acc.find(
			(n) =>
				getGroupingKey(n) === key &&
				isWithinTimeframe(n.createdAt, notification.createdAt, 15),
		);

		if (existing?.data && typeof existing.data === "object") {
			const existingData = existing.data as {
				otherActors?: Array<{ id: string; name: string | null }>;
			};

			if (!existingData.otherActors) {
				existingData.otherActors = [];
			}

			existingData.otherActors.push({
				id: notification.actor.id,
				name: notification.actor.name,
			});

			existing.createdAt = new Date(
				Math.max(
					existing.createdAt.getTime(),
					notification.createdAt.getTime(),
				),
			);
		} else {
			const newData = {
				...((notification.data as object) || {}),
				otherActors: [],
			};
			acc.push({
				...notification,
				data: newData,
			});
		}

		return acc;
	}, [] as NotificationWithActor[]);

	return collatedNotifications;
}
