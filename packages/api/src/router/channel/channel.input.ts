import { z } from "zod";

export const create = z.object({
	watchEventId: z.string(),
});
export type CreateChannelInput = z.infer<typeof create>;

export const isTyping = z.object({
	channelId: z.string(),
	typing: z.boolean(),
});
export type IsTypingInput = z.infer<typeof isTyping>;

export const whoIsTyping = z.object({
	channelId: z.string(),
});
export type WhoIsTypingInput = z.infer<typeof whoIsTyping>;
