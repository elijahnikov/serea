import { movieTableData } from "@serea/validators";
import type { z } from "zod";

export const addMovie = movieTableData.omit({ order: true });
export type AddMovieInput = z.infer<typeof addMovie>;
