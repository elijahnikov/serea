import { z } from "zod";

export const add = z.object({
	channelId: z.string(),
	content: z.string(),
});
export type AddMessageInput = z.infer<typeof add>;

export const onAdd = z.object({
	channelId: z.string(),
	lastEventId: z.string().nullish(),
});
export type OnAddMessageInput = z.infer<typeof onAdd>;
