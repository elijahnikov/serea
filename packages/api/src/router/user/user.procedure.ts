import type { TRPCRouterRecord } from "@trpc/server";
import { protectedProcedure } from "../../trpc";

import * as inputs from "./user.input";
import * as services from "./user.service";

export const userRouter = {
	onboard: protectedProcedure
		.input(inputs.onboardInput)
		.mutation(({ ctx, input }) => services.onboard(ctx, input)),

	checkUsername: protectedProcedure
		.input(inputs.checkUsernameInput)
		.query(({ ctx, input }) => services.checkUsername(ctx, input)),
} satisfies TRPCRouterRecord;
