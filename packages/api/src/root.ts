import { postRouter } from "./router/post";
import { watchedRouter } from "./router/watched/watched.procedure";
import { watchlistRouter } from "./router/watchlist/watchlist.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	post: postRouter,
	watchlist: watchlistRouter,
	watched: watchedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
