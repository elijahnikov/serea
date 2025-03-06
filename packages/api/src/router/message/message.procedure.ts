import { type TRPCRouterRecord, tracked } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import { type MessageType, ee } from "../channel/channel.procedure";
import * as input from "./message.input";
import * as service from "./message.service";

export const messageRouter = {
	// QUERIES
	getInfinite: protectedProcedure
		.input(input.getInfinite)
		.query(async ({ ctx, input }) => service.getInfinite(ctx, input)),
	// MUTATIONS
	add: protectedProcedure
		.input(input.add)
		.mutation(async ({ ctx, input }) => service.addMessage(ctx, input)),

	// SUBSCRIPTIONS
	onAdd: protectedProcedure.input(input.onAdd).subscription(async function* ({
		ctx,
		input,
		signal,
	}) {
		const iterable = ee.toIterable("add", { signal });

		let lastMessageCreatedAt = await (async () => {
			const lastEventId = input.lastEventId;
			if (!lastEventId) return null;

			const messageById = await ctx.db.watchEventChannelMessage.findFirst({
				where: {
					id: lastEventId,
				},
			});

			return messageById?.createdAt ?? null;
		})();

		const newMessagesSinceLastMessage =
			await ctx.db.watchEventChannelMessage.findMany({
				where: {
					channelId: input.channelId,
					...(lastMessageCreatedAt
						? { createdAt: { gt: lastMessageCreatedAt } }
						: {}),
				},
				orderBy: { createdAt: "asc" },
			});

		function* maybeYield(message: MessageType) {
			if (message.channelId !== input.channelId) {
				return;
			}

			if (lastMessageCreatedAt && message.createdAt <= lastMessageCreatedAt) {
				return;
			}

			yield tracked(message.id, message);

			lastMessageCreatedAt = message.createdAt;
		}

		for (const message of newMessagesSinceLastMessage) {
			yield* maybeYield(message);
		}

		for await (const [eventChannelId, message] of iterable) {
			yield* maybeYield(message);
		}
	}),
} satisfies TRPCRouterRecord;
