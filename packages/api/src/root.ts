import { authRouter } from "./router/auth";
import { movieRouter } from "./router/movie/movie.procedure";
import { tmdbRouter } from "./router/tmdb/tmdb.procedure";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
	auth: authRouter,
	tmdb: tmdbRouter,
	movie: movieRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
