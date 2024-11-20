import type { z } from "zod";
import { movieTableData } from "../watchlist/watchlist.input";

export const addMovie = movieTableData.omit({ order: true });
export type AddMovieInput = z.infer<typeof addMovie>;
