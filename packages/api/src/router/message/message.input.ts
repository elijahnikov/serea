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

export const getInfinite = z.object({
	channelId: z.string().uuid(),
	cursor: z.date().nullish(),
	take: z.number().min(1).max(50).nullish(),
});
export type GetInfiniteInput = z.infer<typeof getInfinite>;
