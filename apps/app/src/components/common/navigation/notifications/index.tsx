import { Button } from "@serea/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { BellIcon } from "lucide-react";
import { api } from "~/trpc/server";

export default async function Notifications() {
	const notifications = await api.notification.getNotifications();
	const hasUnread = notifications.some((notification) => !notification.read);
	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button isIconOnly variant="outline" size="sm">
					<BellIcon className="h-4 w-4" />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div>
					<h3>Notifications</h3>
					<p>{JSON.stringify(notifications)}</p>
				</div>
			</PopoverContent>
		</Popover>
	);
}
