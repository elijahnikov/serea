import { z } from "zod";

export const onboardInput = z.object({
	name: z.string(),
	bio: z.string().optional(),
	image: z.string().optional(),
});
export type OnboardInput = z.infer<typeof onboardInput>;
