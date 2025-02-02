import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { tmdbRouter } from "./router/tmdb/tmdb.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	post: postRouter,
	tmdb: tmdbRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
