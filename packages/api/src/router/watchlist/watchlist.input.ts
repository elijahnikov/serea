import { movieTableData } from "@serea/validators";
import { z } from "zod";

// Create a watchlist
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

// Get a watchlist by id
export const getWatchlist = z.object({
	id: z.string(),
});
export type GetWatchlistInput = z.infer<typeof getWatchlist>;

// Get watchlist entries by watchlist id
export const getWatchlistEntries = z.object({
	watchlistId: z.string(),
	limit: z.number().optional(),
	cursor: z.object({ id: z.string(), order: z.number() }).optional(),
});
export type GetWatchlistEntriesInput = z.infer<typeof getWatchlistEntries>;

// Like a watchlist
export const likeWatchlist = z.object({
	id: z.string(),
});
export type LikeWatchlistInput = z.infer<typeof likeWatchlist>;

// Update the order of a watchlist entry
export const updateEntryOrder = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
	newOrder: z.number(),
});
export type UpdateEntryOrderInput = z.infer<typeof updateEntryOrder>;

// Create a comment on a watchlist entry
export const createComment = z.object({
	watchlistId: z.string(),
	content: z.string(),
	parentId: z.string().optional(),
});
export type CreateCommentInput = z.infer<typeof createComment>;

// Like a comment
export const likeComment = z.object({
	commentId: z.string(),
});
export type LikeCommentInput = z.infer<typeof likeComment>;

// Delete a comment
export const deleteComment = z.object({
	commentId: z.string(),
});
export type DeleteCommentInput = z.infer<typeof deleteComment>;

// Add a watchlist entry
export const addWatchlistEntry = z.object({
	watchlistId: z.string(),
	contentId: z.number(),
	content: movieTableData.omit({ order: true }),
});
export type AddWatchlistEntryInput = z.infer<typeof addWatchlistEntry>;

// Delete a watchlist entry
export const deleteEntry = z.object({
	watchlistId: z.string(),
	entryId: z.string(),
});
export type DeleteEntryInput = z.infer<typeof deleteEntry>;

// Invite members to a watchlist
export const inviteMembers = z.object({
	watchlistId: z.string(),
	email: z.string().email(),
	role: z.enum(["VIEWER", "EDITOR"]),
});
export type InviteMembersInput = z.infer<typeof inviteMembers>;

// Delete an invite
export const deleteInvite = z.object({
	inviteId: z.string(),
});
export type DeleteInviteInput = z.infer<typeof deleteInvite>;

// Respond to an invite
export const respondInvite = z.object({
	inviteId: z.string(),
	response: z.enum(["ACCEPT", "REJECT"]),
});
export type RespondInviteInput = z.infer<typeof respondInvite>;
