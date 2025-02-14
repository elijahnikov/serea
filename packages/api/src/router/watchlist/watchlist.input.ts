import { movieTableData } from "@serea/validators";
import { z } from "zod";

export const createWatchlist = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string().optional(),
	tags: z.string().array(),
	entries: movieTableData.array(),
	isPrivate: z.boolean().optional(),
	hideStats: z.boolean().optional(),
});
export type CreateWatchlistInput = z.infer<typeof createWatchlist>;

export const getWatchlist = z.object({
	id: z.string(),
});
export type GetWatchlistInput = z.infer<typeof getWatchlist>;

export const getWatchlistEntries = z.object({
	watchlistId: z.string(),
	limit: z.number().optional(),
	cursor: z.object({ id: z.string(), order: z.number() }).optional(),
});
export type GetWatchlistEntriesInput = z.infer<typeof getWatchlistEntries>;

export const likeWatchlist = z.object({
	id: z.string(),
});
export type LikeWatchlistInput = z.infer<typeof likeWatchlist>;

export const updateEntryOrder = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
	newOrder: z.number(),
});
export type UpdateEntryOrderInput = z.infer<typeof updateEntryOrder>;

export const createComment = z.object({
	watchlistId: z.string(),
	content: z.string(),
	parentId: z.string().optional(),
});
export type CreateCommentInput = z.infer<typeof createComment>;

export const likeComment = z.object({
	commentId: z.string(),
});
export type LikeCommentInput = z.infer<typeof likeComment>;

export const deleteComment = z.object({
	commentId: z.string(),
});
export type DeleteCommentInput = z.infer<typeof deleteComment>;

export const addWatchlistEntry = z.object({
	watchlistId: z.string(),
	contentId: z.number(),
	content: movieTableData.omit({ order: true }),
});
export type AddWatchlistEntryInput = z.infer<typeof addWatchlistEntry>;

export const inviteMembers = z.object({
	watchlistId: z.string(),
	email: z.string().email(),
	role: z.enum(["VIEWER", "EDITOR"]),
});
export type InviteMembersInput = z.infer<typeof inviteMembers>;

export const deleteInvite = z.object({
	inviteId: z.string(),
});
export type DeleteInviteInput = z.infer<typeof deleteInvite>;
