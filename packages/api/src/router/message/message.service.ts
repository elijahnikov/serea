import type { ProtectedTRPCContext } from "../../trpc";
import { currentlyTyping, ee } from "../channel/channel.procedure";
import type { AddMessageInput, GetInfiniteInput } from "./message.input";

export const addMessage = async (
	ctx: ProtectedTRPCContext,
	input: AddMessageInput,
) => {
	const userName = String(ctx.session.user.name);
	const message = await ctx.db.watchEventChannelMessage.create({
		data: {
			channelId: input.channelId,
			content: input.content,
			userId: ctx.session.user.id,
		},
	});

	const formattedMessage = {
		...message,
		isUser: message.userId === ctx.session.user.id,
		user: {
			name: userName,
			id: ctx.session.user.id,
			image: ctx.session.user.image as string | null,
		},
	};

	const channelTyping = currentlyTyping[input.channelId];
	if (channelTyping) {
		delete channelTyping[userName];
		ee.emit("isTypingUpdate", input.channelId, channelTyping);
	}

	ee.emit("add", input.channelId, formattedMessage);

	return message;
};

export const getInfinite = async (
	ctx: ProtectedTRPCContext,
	input: GetInfiniteInput,
) => {
	const currentUserId = ctx.session.user.id;

	const take = input.take ?? 10;
	const cursor = input.cursor;

	const messagesQuery = await ctx.db.watchEventChannelMessage.findMany({
		where: {
			channelId: input.channelId,
			...(input.cursor ? { createdAt: { lte: input.cursor } } : {}),
		},
		orderBy: { createdAt: "desc" },
		take: take + 1,
		include: {
			user: {
				select: {
					name: true,
					id: true,
					image: true,
				},
			},
		},
	});

	const messages = messagesQuery.reverse();
	let nextCursor: typeof cursor | null = null;
	if (messages.length > take) {
		const prev = messages.shift();
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		nextCursor = prev!.createdAt;
	}

	return {
		messages: messages.map((message) => ({
			...message,
			isUser: message.userId === currentUserId,
		})),
		nextCursor,
	};
};
