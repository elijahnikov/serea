import { z } from "zod";

export const watchlistInviteSchema = z.object({
	watchlistId: z.string(),
	inviteeEmail: z.string().email(),
	role: z.enum(["viewer", "editor"]),
});
export type WatchlistInviteSchemaType = z.infer<typeof watchlistInviteSchema>;

export const deleteInviteSchema = z.object({
	invitationId: z.string(),
});
export type DeleteInviteSchemaType = z.infer<typeof deleteInviteSchema>;

export const respondToInviteSchema = z.object({
	invitationId: z.string(),
	response: z.enum(["accept", "decline"]),
});
export type RespondToInviteSchemaType = z.infer<typeof respondToInviteSchema>;

export const updateRoleSchema = z.object({
	watchlistId: z.string(),
	memberId: z.string(),
	role: z.enum(["viewer", "editor"]),
});
export type UpdateRoleSchemaType = z.infer<typeof updateRoleSchema>;

export const listMembersSchema = z.object({
	watchlistId: z.string(),
});
export type ListMembersSchemaType = z.infer<typeof listMembersSchema>;

export const listInvitesSchema = z.object({
	watchlistId: z.string(),
});
export type ListInvitesSchemaType = z.infer<typeof listMembersSchema>;

export const deleteMemberSchema = z.object({
	watchlistId: z.string(),
	memberId: z.string(),
});
export type DeleteMemberSchemaType = z.infer<typeof deleteMemberSchema>;
