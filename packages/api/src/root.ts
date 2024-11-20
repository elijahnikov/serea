import { moviesRouter } from "./router/movies/movies.procedure";
import { postRouter } from "./router/post";
import { tmdbRouter } from "./router/tmdb/tmdb.procedure";
import { watchedRouter } from "./router/watched/watched.procedure";
import { watchlistRouter } from "./router/watchlist/watchlist.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	post: postRouter,
	watchlist: watchlistRouter,
	watched: watchedRouter,
	tmdb: tmdbRouter,
	movie: moviesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
