import { authRouter } from "./router/auth/auth.procedure";
import { movieRouter } from "./router/movie/movie.procedure";
import { notificationRouter } from "./router/notification/notification.procedure";
import { postRouter } from "./router/post";
import { tmdbRouter } from "./router/tmdb/tmdb.procedure";
import { userRouter } from "./router/user/user.procedure";
import { watchEventRouter } from "./router/watch-event/watch-event.procedure";
import { watchedRouter } from "./router/watched/watched.procedure";
import { watchlistRouter } from "./router/watchlist/watchlist.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	user: userRouter,
	post: postRouter,
	tmdb: tmdbRouter,
	movie: movieRouter,
	watchlist: watchlistRouter,
	notification: notificationRouter,
	watched: watchedRouter,
	watchEvent: watchEventRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
