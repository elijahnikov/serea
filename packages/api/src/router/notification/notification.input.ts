import { NotificationType } from "@serea/db";
import { z } from "zod";

export const createNotification = z.object({
	type: z.nativeEnum(NotificationType),
	data: z.record(z.any()),
	userId: z.string(),
	actorId: z.string(),
});
export type CreateNotification = z.infer<typeof createNotification>;

export const markNotificationAsRead = z.object({
	notificationId: z.string(),
});
export type MarkNotificationAsRead = z.infer<typeof markNotificationAsRead>;
