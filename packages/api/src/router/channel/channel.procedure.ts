import EventEmitter, { on } from "node:events";
import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as input from "./channel.input";
import * as service from "./channel.service";

type User = {
	id: string;
	name: string;
	image: string | null | undefined;
};
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
	user: {
		name: string;
		id: string;
		image: string | null;
	};
	isUser: boolean;
};
export interface Events {
	add: [channelId: string, message: MessageType];
	isTypingUpdate: [channelId: string, who: WhoIsTyping];
	participantsUpdate: [channelId: string, participants: User[]];
}

export const ee = new IterativeEventEmitter<Events>();

export const currentlyTyping: Record<string, WhoIsTyping> = Object.create(null);
export const whoIsParticipating: Record<string, User[]> = Object.create(null);

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
	// QUERIES
	getChannel: protectedProcedure
		.input(input.getChannel)
		.query(async ({ ctx, input }) => service.getChannel(ctx, input)),
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

	hasJoined: protectedProcedure
		.input(input.hasJoined)
		.mutation(async ({ ctx, input }) => {
			const { channelId, joined } = input;

			const channelExists = await ctx.db.watchEventChannel.findFirst({
				where: {
					id: channelId,
				},
				include: {
					watchEvent: {
						select: {
							watchlistId: true,
						},
					},
				},
			});

			if (!channelExists) {
				return;
			}

			const isMember = await ctx.db.watchlistMember.findFirst({
				where: {
					watchlistId: channelExists.watchEvent.watchlistId,
					userId: ctx.session.user.id,
				},
			});

			if (!isMember) {
				return;
			}

			if (!whoIsParticipating[channelId]) {
				whoIsParticipating[channelId] = [];
			}

			if (joined) {
				const userExists = whoIsParticipating[channelId].some(
					(user) => user.id === ctx.session.user.id,
				);

				if (!userExists) {
					whoIsParticipating[channelId] = [
						...whoIsParticipating[channelId],
						{
							id: ctx.session.user.id,
							name: String(ctx.session.user.name),
							image: ctx.session.user.image,
						},
					];

					setTimeout(() => {
						ee.emit(
							"participantsUpdate",
							channelId,
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							whoIsParticipating[channelId]!,
						);
					}, 100);
				}
			} else {
				whoIsParticipating[channelId] = whoIsParticipating[channelId].filter(
					(user) => user.id !== ctx.session.user.id,
				);

				ee.emit("participantsUpdate", channelId, whoIsParticipating[channelId]);
			}

			return whoIsParticipating[channelId];
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

	whoIsParticipating: protectedProcedure
		.input(input.whoIsTyping)
		.subscription(async function* ({ input, signal }) {
			let lastParticipants = "";

			function* maybeYield(participants: User[]) {
				const idx = participants
					.map((p) => p.id)
					.sort()
					.toString();
				if (idx === lastParticipants) {
					return;
				}
				yield participants;
				lastParticipants = idx;
			}

			yield* maybeYield(whoIsParticipating[input.channelId] ?? []);

			for await (const [eventChannelId, participants] of ee.toIterable(
				"participantsUpdate",
				{
					signal,
				},
			)) {
				if (eventChannelId === input.channelId) {
					yield* maybeYield(participants);
				}
			}
		}),
} satisfies TRPCRouterRecord;
