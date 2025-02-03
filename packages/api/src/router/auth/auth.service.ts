import { invalidateSessionToken } from "@serea/auth";
import type { ProtectedTRPCContext } from "../../trpc";

export const signOut = async (ctx: ProtectedTRPCContext) => {
	if (!ctx.token) {
		return { success: false };
	}
	await invalidateSessionToken(ctx.token);
	return { success: true };
};
