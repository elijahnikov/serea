import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type {
	CreateChannelInput,
	GetChannelInput,
	IsTypingInput,
} from "./channel.input";

export const createChannel = async (
	ctx: ProtectedTRPCContext,
	input: CreateChannelInput,
) => {
	const watchEvent = await ctx.db.watchEvent.findUnique({
		where: {
			id: input.watchEventId,
		},
	});

	if (!watchEvent) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Watch event not found",
		});
	}

	const channelExists = await ctx.db.watchEventChannel.findUnique({
		where: {
			watchEventId: input.watchEventId,
		},
	});

	if (channelExists) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Channel already exists",
		});
	}

	const channel = await ctx.db.watchEventChannel.create({
		data: {
			watchEventId: input.watchEventId,
		},
	});

	return channel.id;
};

export const getChannel = async (
	ctx: ProtectedTRPCContext,
	input: GetChannelInput,
) => {
	const channel = await ctx.db.watchEventChannel.findUnique({
		where: {
			id: input.channelId,
		},
	});

	if (!channel) {
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Channel not found",
		});
	}

	return channel;
};
