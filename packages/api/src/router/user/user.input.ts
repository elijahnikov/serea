import { z } from "zod";

export const onboardInput = z.object({
	name: z.string(),
	bio: z.string().optional(),
	image: z.string().optional(),
	website: z.string().optional(),
	instagram: z.string().optional(),
	tiktok: z.string().optional(),
	twitter: z.string().optional(),
});
export type OnboardInput = z.infer<typeof onboardInput>;

export const checkUsernameInput = z.object({
	username: z.string(),
});
export type CheckUsernameInput = z.infer<typeof checkUsernameInput>;
