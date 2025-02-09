import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type { CheckUsernameInput, OnboardInput } from "./user.input";

export const onboard = async (
	ctx: ProtectedTRPCContext,
	input: OnboardInput,
) => {
	if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
	const userId = ctx.session.user.id;

	await ctx.db.user.update({
		where: {
			id: userId,
		},
		data: {
			...input,
			onboarded: true,
			genres: input.genres,
			biography: input.bio,
			name: input.name,
			image: input.image,
			website: input.website,
			instagram: input.instagram,
			tiktok: input.tiktok,
			twitter: input.twitter,
		},
	});

	return {
		success: true,
	};
};

export const checkUsername = async (
	ctx: ProtectedTRPCContext,
	input: CheckUsernameInput,
) => {
	const usernameExists = await ctx.db.user.findFirst({
		where: {
			name: input.username,
		},
		select: {
			name: true,
		},
	});

	return {
		exists: !!usernameExists,
	};
};
