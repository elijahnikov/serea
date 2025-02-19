import { NotificationType } from "@serea/db";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	CreateNotification,
	MarkNotificationAsRead,
} from "./notification.input";
import { collateNotifications } from "./utils";

export const createNotification = async (
	ctx: ProtectedTRPCContext,
	input: CreateNotification,
) => {
	const notification = await ctx.db.notification.create({
		data: {
			userId: input.userId,
			actorId: input.actorId,
			type: input.type,
			data: input.data,
		},
	});

	return notification;
};

export const getNotifications = async (ctx: ProtectedTRPCContext) => {
	const currentUserId = ctx.session.user.id;
	const notifications = await ctx.db.notification.findMany({
		where: { userId: currentUserId },
		orderBy: { createdAt: "desc" },
		include: {
			actor: {
				select: {
					name: true,
					id: true,
					image: true,
				},
			},
		},
	});
	return collateNotifications(notifications);
};

export const markNotificationAsRead = async (
	ctx: ProtectedTRPCContext,
	input: MarkNotificationAsRead,
) => {
	const currentUserId = ctx.session.user.id;
	await ctx.db.notification.update({
		where: { id: input.notificationId, userId: currentUserId, read: false },
		data: { read: true },
	});
};

export const markAllNotificationsAsRead = async (ctx: ProtectedTRPCContext) => {
	const currentUserId = ctx.session.user.id;
	await ctx.db.notification.updateMany({
		where: { userId: currentUserId, read: false },
		data: { read: true },
	});
};
