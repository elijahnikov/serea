import { authRouter } from "./router/auth/auth.procedure";
import { movieRouter } from "./router/movie/movie.procedure";
import { postRouter } from "./router/post";
import { tmdbRouter } from "./router/tmdb/tmdb.procedure";
import { userRouter } from "./router/user/user.procedure";
import { watchlistRouter } from "./router/watchlist/watchlist.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	user: userRouter,
	post: postRouter,
	tmdb: tmdbRouter,
	movie: movieRouter,
	watchlist: watchlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
