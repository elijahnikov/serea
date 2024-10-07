const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const TMDB_API_URLS = {
	trendingThisWeek: `${TMDB_BASE_URL}/trending/movie/week?language=en-US`,
	movieSearch: (query: string) =>
		`${TMDB_BASE_URL}/search/movie?${query}&include_adult=false&language=en-US&page=1`,
	showSearch: (query: string) =>
		`${TMDB_BASE_URL}/search/tv?${query}include_adult=false&language=en-US&page=1`,
};
