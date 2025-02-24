"use client";

import type { RouterOutputs } from "@serea/api";
import type { Role } from "@serea/db";
import { Avatar } from "@serea/ui/avatar";
import { cn } from "@serea/ui/cn";
import { LoadingButton } from "@serea/ui/loading-button";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import _ from "lodash";
import { CheckIcon, XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "~/trpc/react";

dayjs.extend(relativeTime);

type Invite = {
	watchlistId: string;
	watchlistTitle: string;
	inviteId: string;
	role: Role;
};
export default function NotificationWatchlistInvite({
	notification,
}: {
	notification: RouterOutputs["notification"]["getNotifications"][number];
}) {
	const router = useRouter();
	const apiUtils = api.useUtils();
	const respond = api.watchlist.respondInvite.useMutation({
		onSuccess: () => {
			apiUtils.notification.getNotifications.invalidate();
			toast.success(
				`You are now a collaborator on ${notificationData.watchlistTitle}, redirecting...`,
			);
			router.push(`/watchlist/${notificationData.watchlistId}`);
		},
	});
	const notificationData = notification.data as Invite;
	return (
		<div
			className={cn("flex flex-col gap-2", notification.read && "opacity-50")}
		>
			<span className="font-mono text-carbon-900 text-xs flex items-center gap-1">
				{!notification.read && (
					<div className="h-2 w-2 bg-primary rounded-full" />
				)}{" "}
				INVITE
			</span>
			<div className="flex items-center gap-2">
				<Avatar
					src={notification.actor.image ?? undefined}
					size="sm"
					initials={notification.actor.name?.slice(0, 2)}
				/>
				<div className="flex flex-col gap-1">
					<p className="text-sm text-carbon-900">
						<span className="font-medium text-white">
							{notification.actor.name}
						</span>{" "}
						has invited you to collaborate on{" "}
						<span className="font-medium text-white">
							{notificationData.watchlistTitle}
						</span>
					</p>
					<p className="text-carbon-900 text-xs">
						{dayjs(notification.createdAt).fromNow()}
					</p>
					{!notification.read && (
						<div className="flex -ml-1 mt-1 items-center gap-2">
							<LoadingButton
								loading={
									respond.isPending && respond.variables?.response === "ACCEPT"
								}
								onClick={() =>
									respond.mutate({
										inviteId: notificationData.inviteId,
										response: "ACCEPT",
									})
								}
								before={<CheckIcon />}
								variant="outline"
							>
								Accept
							</LoadingButton>
							<LoadingButton
								loading={
									respond.isPending && respond.variables?.response === "REJECT"
								}
								onClick={() =>
									respond.mutate({
										inviteId: notificationData.inviteId,
										response: "REJECT",
									})
								}
								before={<XIcon />}
								variant="outline"
							>
								Decline
							</LoadingButton>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
