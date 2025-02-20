import { Button } from "@serea/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { Badge, BellIcon } from "lucide-react";
import { api } from "~/trpc/server";
import NotificationRow from "./notification-row";

export default async function Notifications() {
	const notifications = await api.notification.getNotifications();
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
			<PopoverContent>
				{notifications.map((notification) => (
					<NotificationRow key={notification.id} notification={notification} />
				))}
			</PopoverContent>
		</Popover>
	);
}
