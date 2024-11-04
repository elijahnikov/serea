import { z } from "zod";

// --------------------------------------------------------------------
// QUERIES
// --------------------------------------------------------------------

// GET MEMBER ROLE FOR WATCHLIST
export const getMemberRole = z.object({
	watchlistId: z.string(),
});

// LIST INVITES FOR WATCHLIST
export const listInvites = z.object({
	watchlistId: z.string(),
});

// LIST MEMBERS FOR WATCHLIST
export const listMembersSchema = z.object({
	watchlistId: z.string(),
});

export type GetMemberRole = z.infer<typeof getMemberRole>;
export type ListInvites = z.infer<typeof listInvites>;
export type ListMembers = z.infer<typeof listMembersSchema>;

// --------------------------------------------------------------------
// ACTIONS
// --------------------------------------------------------------------

// DELETE INVITE
export const deleteInvite = z.object({
	invitationId: z.string(),
});

// DELETE MEMBER FROM WATCHLIST
export const deleteMember = z.object({
	watchlistId: z.string(),
	memberId: z.string(),
});

// INVITE TO WATCHLIST
export const watchlistInvite = z.object({
	watchlistId: z.string(),
	inviteeEmail: z.string().email(),
	role: z.enum(["viewer", "editor"]),
});

// RESPOND TO INVITE
export const respondToInvite = z.object({
	invitationId: z.string(),
	response: z.enum(["accept", "decline"]),
});

// UPDATE ROLE
export const updateRole = z.object({
	watchlistId: z.string(),
	memberId: z.string(),
	role: z.enum(["viewer", "editor"]),
});

export type UpdateRole = z.infer<typeof updateRole>;
export type RespondToInvite = z.infer<typeof respondToInvite>;
export type WatchlistInvite = z.infer<typeof watchlistInvite>;
export type DeleteMember = z.infer<typeof deleteMember>;
export type DeleteInvite = z.infer<typeof deleteInvite>;
