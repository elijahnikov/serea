import { eq } from "@serea/db";
import { User } from "@serea/db/schema";
import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type { CheckUsernameInput, OnboardInput } from "./user.input";

export const onboard = async (
	ctx: ProtectedTRPCContext,
	input: OnboardInput,
) => {
	if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
	const userId = ctx.session.user.id;

	await ctx.db
		.update(User)
		.set({
			...input,
			name: input.name,
			image: input.image,
			biography: input.bio,
			onboarded: true,
		})
		.where(eq(User.id, userId));

	return {
		success: true,
	};
};

export const checkUsername = async (
	ctx: ProtectedTRPCContext,
	input: CheckUsernameInput,
) => {
	const usernameExists = await ctx.db.query.User.findFirst({
		where: eq(User.name, input.username),
		columns: {
			name: true,
		},
	});

	return {
		exists: !!usernameExists,
	};
};
