import type { ProtectedTRPCContext } from "../../trpc";
import { currentlyTyping, ee } from "../channel/channel.procedure";
import type { AddMessageInput } from "./message.input";

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

	const channelTyping = currentlyTyping[input.channelId];
	if (channelTyping) {
		delete channelTyping[userName];
		ee.emit("isTypingUpdate", input.channelId, channelTyping);
	}

	ee.emit("add", input.channelId, message);

	return message;
};
