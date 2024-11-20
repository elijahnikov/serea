"use client";

import type { RouterOutputs } from "@serea/api";
import Input from "@serea/ui/input";
import Loading from "@serea/ui/loading";
import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import type { MovieTableData } from "@serea/validators";
import { Clapperboard } from "lucide-react";

import { useState } from "react";
import useDebounce from "~/hooks/use-debounce";
import { TMDB_IMAGE_BASE_URL_SD } from "~/lib/constants";
import { api } from "~/trpc/react";

export default function MovieSearch({
	callback,
}: { callback: (movie: Omit<MovieTableData, "order">) => void }) {
	const [searchText, setSearchText] = useState<string>("");
	const debouncedSearchTerm = useDebounce(searchText, 500);

	const { data: searchResults, isFetching } = api.tmdb.searchMovies.useQuery(
		{ query: debouncedSearchTerm },
		{
			enabled: Boolean(debouncedSearchTerm) && debouncedSearchTerm !== "",
		},
	);

	return (
		<div className="max-w-[400px] w-full">
			<Input
				className="focus:outline-none"
				onChange={(e) => setSearchText(e.target.value)}
				placeholder="Search for a movie..."
			/>

			<div className="bg-surface mt-4 py-3 border border-dashed shadow-wg-xs overflow-y-auto max-h-[160px] flex flex-col justify-between items-center w-full min-h-[160px] rounded-lg">
				{isFetching && (
					<div className="w-full h-[160px] flex flex-col items-center justify-center">
						<Loading type="spinner" color="secondary" size="xs" />
					</div>
				)}
				{searchResults && !isFetching && searchResults.results.length > 0 ? (
					<TooltipProvider>
						<div className="grid grid-cols-4 gap-2">
							{searchResults.results.map((movie) => (
								<MovieResult
									handleClick={callback}
									key={movie.id}
									movie={movie}
								/>
							))}
						</div>
					</TooltipProvider>
				) : !isFetching ? (
					<div className="h-[160px] w-full flex flex-col justify-center items-center">
						<Clapperboard
							className="dark:text-neutral-300 text-neutral-500"
							size={24}
						/>
						<p className="font-medium dark:text-neutral-400 text-neutral-600">
							Search results will appear here
						</p>
					</div>
				) : null}
			</div>
		</div>
	);
}

function MovieResult({
	movie,
	handleClick,
}: {
	movie: RouterOutputs["tmdb"]["searchMovies"]["results"][number];
	handleClick: (movie: Omit<MovieTableData, "order">) => void;
}) {
	return (
		<TooltipRoot>
			<TooltipTrigger asChild>
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<div
					onClick={() =>
						handleClick({
							contentId: movie.id,
							releaseDate: movie.release_date,
							title: movie.original_title,
							backdrop: movie.backdrop_path,
							overview: movie.overview,
							poster: movie.poster_path,
						})
					}
					className="flex active:scale-[0.95] duration-200 transition cursor-pointer bg-white w-full rounded-lg border dark:border-neutral-600"
				>
					{movie.poster_path ? (
						<img
							className="aspect-auto rounded-md"
							src={`${TMDB_IMAGE_BASE_URL_SD}${movie.poster_path}`}
							alt={`Poster for ${movie.original_title}`}
							width={70}
							height={110}
						/>
					) : (
						<div className="w-full min-h-[110px] flex-col max-w-[70px] text-center h-full justify-center flex items-center">
							<p className="text-wrap text-xs font-medium text-neutral-600">
								{movie.original_title}
							</p>
							<p className="text-wrap text-xs font-medium text-neutral-400">
								{new Date(movie.release_date).getFullYear()}
							</p>
						</div>
					)}
				</div>
			</TooltipTrigger>
			<TooltipProvider>
				<TooltipContent className="flex items-center space-x-1">
					<p className="font-medium">{movie.original_title}</p>
					<p className="font-medium text-neutral-400">
						{new Date(movie.release_date).getFullYear()}
					</p>
				</TooltipContent>
			</TooltipProvider>
		</TooltipRoot>
	);
}
