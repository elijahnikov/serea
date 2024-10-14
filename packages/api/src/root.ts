import { authRouter } from "./router/auth";
import { membersRouter } from "./router/members/members.procedure";
import { movieRouter } from "./router/movie/movie.procedure";
import { tmdbRouter } from "./router/tmdb/tmdb.procedure";
import { watchlistRouter } from "./router/watchlist/watchlist.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	tmdb: tmdbRouter,
	movie: movieRouter,
	watchlist: watchlistRouter,
	members: membersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
