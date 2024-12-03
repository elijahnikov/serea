import { z } from "zod";

export const getComments = z.object({
	watchlistId: z.string(),
	limit: z.number().optional(),
	cursor: z.date().optional(),
});
export type GetCommentsInput = z.infer<typeof getComments>;

export const createComment = z.object({
	watchlistId: z.string(),
	content: z.string(),
});
export type CreateCommentInput = z.infer<typeof createComment>;

export const deleteComment = z.object({
	commentId: z.string(),
});
export type DeleteCommentInput = z.infer<typeof deleteComment>;
