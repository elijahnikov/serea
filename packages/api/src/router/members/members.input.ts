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
