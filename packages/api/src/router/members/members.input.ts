import { z } from "zod";

export const watchlistInvite = z.object({
	watchlistId: z.string(),
	inviteeEmail: z.string().email(),
	role: z.enum(["viewer", "editor"]),
});

export const respondToInvite = z.object({
	invitationId: z.string(),
	response: z.enum(["accept", "decline"]),
});

export const updateRole = z.object({
	watchlistId: z.string(),
	memberId: z.string(),
	role: z.enum(["viewer", "editor"]),
});

export const deleteMember = z.object({
	watchlistId: z.string(),
	memberId: z.string(),
});

export const deleteInvite = z.object({
	invitationId: z.string(),
});

export const listMembers = z.object({
	watchlistId: z.string(),
});

export const listInvites = z.object({
	watchlistId: z.string(),
});

export const getMemberRole = z.object({
	watchlistId: z.string(),
});
