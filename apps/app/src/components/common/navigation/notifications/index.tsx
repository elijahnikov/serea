"use client";

import { Button } from "@serea/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { BellIcon } from "lucide-react";
import * as React from "react";
import { api } from "~/trpc/react";
import NotificationRow from "./notification-row";

export default function Notifications() {
	const [notifications] = api.notification.getNotifications.useSuspenseQuery(
		undefined,
		{
			refetchOnWindowFocus: true,
			refetchInterval: 60000,
		},
	);
	const hasUnread = notifications.some((notification) => !notification.read);
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant="outline" size="sm" className="h-10">
					<div className="relative">
						{hasUnread && (
							<div className="absolute left-2 animate-pulse -top-1 flex h-2 w-2 items-center justify-center rounded-full bg-red-500" />
						)}
						<BellIcon className="h-4 w-4" />
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="min-w-96 h-max">
				<div className="flex justify-between gap-2 items-center border-b -mx-4 px-4 -mt-2 mb-2 pb-2">
					<h1 className="text-carbon-900 font-medium text-sm">
						{notifications.filter((notification) => !notification.read).length}{" "}
						Notifications
					</h1>
					<Button variant="outline" size="sm">
						Mark all as read
					</Button>
				</div>
				<div className="bg-white gap-4 max-h-[400px] overflow-y-auto p-4 dark:bg-carbon-dark-200 border border-dashed shadow-sm flex flex-col items-center w-full min-h-64 rounded-lg">
					{notifications.length > 0 ? (
						notifications.map((notification, index) => (
							<React.Fragment key={notification.id}>
								<NotificationRow
									key={notification.id}
									notification={notification}
								/>
								{notifications.length > 1 &&
									index !== notifications.length - 1 && (
										<hr className="h-[1px] w-full" />
									)}
							</React.Fragment>
						))
					) : (
						<div className="min-h-full h-64 flex items-center justify-center">
							<p className="text-carbon-900 font-medium text-sm">
								You're all caught up!
							</p>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
