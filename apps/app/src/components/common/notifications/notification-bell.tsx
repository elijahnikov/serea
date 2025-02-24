"use client";

import { Button } from "@serea/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";

import { BellIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

export default function NotificationBell() {
	const [unreadCount, setUnreadCount] = useState(0);
	const utils = api.useUtils();

	const { data: notifications } = api.notification.getUnread.useQuery();
	const { mutate: markAsRead } = api.notification.markAsRead.useMutation({
		onSuccess: () => {
			utils.notification.getUnread.invalidate();
		},
	});
	const { mutate: markAllAsRead } = api.notification.markAllAsRead.useMutation({
		onSuccess: () => {
			utils.notification.getUnread.invalidate();
		},
	});

	useEffect(() => {
		setUnreadCount(notifications?.length ?? 0);
	}, [notifications]);

	api.notification.subscribe.useSubscription(undefined, {
		onData(notification) {
			utils.notification.getUnread.invalidate();
		},
	});

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="relative">
					<BellIcon className="h-5 w-5" />
					{unreadCount > 0 && (
						<span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
							{unreadCount}
						</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80">
				<div className="flex justify-between items-center mb-2">
					<h4 className="font-semibold">Notifications</h4>
					{unreadCount > 0 && (
						<Button size="sm" onClick={() => markAllAsRead()}>
							Mark all as read
						</Button>
					)}
				</div>

				{notifications?.length === 0 ? (
					<p className="text-center text-muted-foreground py-8">
						No new notifications
					</p>
				) : (
					<div className="flex flex-col gap-2">
						{notifications?.map((notification) => (
							// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
							<div
								key={notification.id}
								className="p-2 hover:bg-muted rounded-lg cursor-pointer"
								onClick={() => markAsRead({ notificationId: notification.id })}
							>
								<p className="text-sm">{notification.message}</p>
								<span className="text-xs text-muted-foreground">
									{new Date(notification.createdAt).toLocaleDateString()}
								</span>
							</div>
						))}
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
