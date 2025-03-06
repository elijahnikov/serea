import EventEmitter, { on } from "node:events";
import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as input from "./channel.input";
import * as service from "./channel.service";

export type WhoIsTyping = Record<string, { lastTyped: Date }>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type EventMap<T> = Record<keyof T, any[]>;
class IterativeEventEmitter<T extends EventMap<T>> extends EventEmitter<T> {
	toIterable<TEventName extends keyof T & string>(
		eventName: TEventName,
		opts?: NonNullable<Parameters<typeof on>[2]>,
	): AsyncIterable<T[TEventName]> {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return on(this as any, eventName, opts) as any;
	}
}

export type MessageType = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: string;
	content: string;
	channelId: string;
};
export interface Events {
	add: [channelId: string, message: MessageType];
	isTypingUpdate: [channelId: string, who: WhoIsTyping];
}

export const ee = new IterativeEventEmitter<Events>();

export const currentlyTyping: Record<string, WhoIsTyping> = Object.create(null);

setInterval(() => {
	const updatedChannels = new Set<string>();
	const now = Date.now();

	for (const [channelId, typers] of Object.entries(currentlyTyping)) {
		for (const [key, value] of Object.entries(typers ?? {})) {
			if (now - value.lastTyped.getTime() > 1000) {
				delete typers[key];
				updatedChannels.add(channelId);
			}
		}
	}
	for (const channelId of updatedChannels) {
		ee.emit("isTypingUpdate", channelId, currentlyTyping[channelId] ?? {});
	}
}, 1000).unref();

export const channelRouter = {
	// MUTATIONS
	create: protectedProcedure
		.input(input.create)
		.mutation(async ({ ctx, input }) => service.createChannel(ctx, input)),

	isTyping: protectedProcedure
		.input(input.isTyping)
		.mutation(async ({ ctx, input }) => {
			const userName = String(ctx.session.user.name);
			const { channelId } = input;

			if (!currentlyTyping[channelId]) {
				currentlyTyping[channelId] = {};
			}

			if (!input.typing) {
				delete currentlyTyping[channelId][userName];
			} else {
				currentlyTyping[channelId][userName] = {
					lastTyped: new Date(),
				};
			}
			ee.emit("isTypingUpdate", channelId, currentlyTyping[channelId]);
		}),

	// SUBSCRIPTIONS
	whoIsTyping: protectedProcedure
		.input(input.whoIsTyping)
		.subscription(async function* ({ input, signal }) {
			let lastIsTyping = "";

			function* maybeYield(who: WhoIsTyping) {
				const idx = Object.keys(who).sort().toString();
				if (idx === lastIsTyping) {
					return;
				}
				yield Object.keys(who);
				lastIsTyping = idx;
			}

			yield* maybeYield(currentlyTyping[input.channelId] ?? {});

			for await (const [eventChannelId, who] of ee.toIterable(
				"isTypingUpdate",
				{
					signal,
				},
			)) {
				if (eventChannelId === input.channelId) {
					yield* maybeYield(who);
				}
			}
		}),
} satisfies TRPCRouterRecord;
