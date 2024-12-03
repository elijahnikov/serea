import { commentsRouter } from "./router/comments/comments.procedure";
import { membersRouter } from "./router/members/members.procedure";
import { moviesRouter } from "./router/movies/movies.procedure";
import { tmdbRouter } from "./router/tmdb/tmdb.procedure";
import { watchedRouter } from "./router/watched/watched.procedure";
import { watchlistRouter } from "./router/watchlist/watchlist.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	watchlist: watchlistRouter,
	watched: watchedRouter,
	tmdb: tmdbRouter,
	movie: moviesRouter,
	members: membersRouter,
	comments: commentsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
