import { movieTableData } from "../watchlist/watchlist.input";

export const addMovie = movieTableData.omit({ order: true });
