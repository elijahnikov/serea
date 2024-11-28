import { z } from "zod";

export const watchlistInvite = z.object({
	watchlistId: z.string(),
	email: z.string().email(),
	role: z.enum(["viewer", "editor"]),
});
export type CreateInviteInput = z.infer<typeof watchlistInvite>;

export const respondToInvite = z.object({
	invitationId: z.string(),
	response: z.enum(["accept", "decline"]),
});
export type RespondToInviteInput = z.infer<typeof respondToInvite>;

export const updateRole = z.object({
	watchlistId: z.string(),
	memberId: z.string(),
	role: z.enum(["viewer", "editor"]),
});
export type UpdateRoleInput = z.infer<typeof updateRole>;

export const deleteMember = z.object({
	watchlistId: z.string(),
	memberId: z.string(),
});
export type DeleteMemberInput = z.infer<typeof deleteMember>;

export const deleteInvite = z.object({
	invitationId: z.string(),
});
export type DeleteInviteInput = z.infer<typeof deleteInvite>;

export const listMembers = z.object({
	watchlistId: z.string(),
});
export type ListMembersInput = z.infer<typeof listMembers>;

export const listInvites = z.object({
	watchlistId: z.string(),
});
export type ListInvitesInput = z.infer<typeof listInvites>;

export const getMemberRole = z.object({
	watchlistId: z.string(),
});
