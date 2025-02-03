import { TRPCError } from "@trpc/server";
import type { ProtectedTRPCContext } from "../../trpc";
import type { OnboardInput } from "./user.input";

export const onboard = async (
	ctx: ProtectedTRPCContext,
	input: OnboardInput,
) => {
	if (!ctx.session) throw new TRPCError({ code: "UNAUTHORIZED" });
	const userId = ctx.session.user.id;

	// const user = await ctx.db.query.User.update({
	// 	where: {
	// 		id: userId,
	// 	},
	// 	data: {
	// 		name: input.name,
	// 		image: input.image,
	// 	},
	// });
	// return user;
};
