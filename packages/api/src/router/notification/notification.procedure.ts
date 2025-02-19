import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure } from "../../trpc";
import * as input from "./notification.input";
import * as service from "./notification.service";

export const notificationRouter = {
	// QUERIES
	getNotifications: protectedProcedure.query(async ({ ctx }) =>
		service.getNotifications(ctx),
	),

	// MUTATIONS
	createNotification: protectedProcedure
		.input(input.createNotification)
		.mutation(async ({ ctx, input }) => service.createNotification(ctx, input)),

	markNotificationAsRead: protectedProcedure
		.input(input.markNotificationAsRead)
		.mutation(async ({ ctx, input }) =>
			service.markNotificationAsRead(ctx, input),
		),

	markAllNotificationsAsRead: protectedProcedure.mutation(async ({ ctx }) =>
		service.markAllNotificationsAsRead(ctx),
	),
} satisfies TRPCRouterRecord;
