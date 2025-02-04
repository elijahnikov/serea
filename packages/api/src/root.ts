import { authRouter } from "./router/auth/auth.procedure";
import { postRouter } from "./router/post";
import { tmdbRouter } from "./router/tmdb/tmdb.procedure";
import { userRouter } from "./router/user/user.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	user: userRouter,
	post: postRouter,
	tmdb: tmdbRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
