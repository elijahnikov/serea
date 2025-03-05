import type { RouterOutputs } from "@serea/api";
import { Input } from "@serea/ui/input";
import { Spinner } from "@serea/ui/spinner";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import type { MovieTableData } from "@serea/validators";
import { ClapperboardIcon } from "lucide-react";
import * as React from "react";
import { TMDB_IMAGE_BASE_URL_SD } from "~/lib/constants";
import useDebounce from "~/lib/hooks/use-debounce";
import { api } from "~/trpc/react";

type MovieSearchProps = {
	callback: (movie: Omit<MovieTableData, "order">) => void;
};

export default function MovieSearch({ callback }: MovieSearchProps) {
	const [searchText, setSearchText] = React.useState<string>("");
	const debouncedSearchTerm = useDebounce(searchText, 500) as string;

	const { data: searchResults, isFetching } = api.tmdb.movieSearch.useQuery(
		{ query: debouncedSearchTerm },
		{
			enabled: Boolean(debouncedSearchTerm) && debouncedSearchTerm !== "",
		},
	);

	const { mutate: addMovie } = api.movie.add.useMutation();

	return (
		<div className="w-full">
			<Input
				className="focus:outline-none"
				value={searchText}
				onChange={(e) => setSearchText(e.target.value)}
				placeholder="Search for a movie"
			/>
			<div className="mt-4 p-1 max-h-[300px] overflow-y-auto">
				{isFetching && (
					<div className="w-full h-[160px] flex flex-col items-center justify-center">
						<Spinner size="sm" />
					</div>
				)}
				{searchResults && !isFetching && searchResults.results.length > 0 ? (
					<TooltipProvider>
						<div className="grid grid-cols-4 gap-2">
							{searchResults.results
								.sort((a, b) => b.popularity - a.popularity)
								.map((movie) => (
									<MovieResult
										handleClick={(movie) => {
											addMovie({
												backdrop: movie.backdrop,
												contentId: movie.contentId,
												poster: movie.poster,
												releaseDate: movie.releaseDate,
												title: movie.title,
												overview: movie.overview,
											});
											callback(movie);
										}}
										key={movie.id}
										movie={movie}
									/>
								))}
						</div>
					</TooltipProvider>
				) : !isFetching ? (
					<div className="h-[160px] w-full flex flex-col justify-center items-center">
						<ClapperboardIcon className="text-muted-foreground" size={24} />
						<p className="font-medium text-muted-foreground text-sm">
							Search results will appear here
						</p>
					</div>
				) : null}
			</div>
		</div>
	);
}

type MovieResultProps = {
	movie: RouterOutputs["tmdb"]["movieSearch"]["results"][number];
	handleClick: (movie: Omit<MovieTableData, "order">) => void;
};
function MovieResult({ movie, handleClick }: MovieResultProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<div
					// biome-ignore lint/a11y/useSemanticElements: <explanation>
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							handleClick({
								contentId: movie.id,
								releaseDate: movie.release_date,
								title: movie.original_title,
								backdrop: movie.backdrop_path,
								overview: movie.overview,
								poster: movie.poster_path,
							});
						}
					}}
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
					className="flex active:scale-[0.95] duration-200 transition cursor-pointer w-full rounded-[4px] border focus:outline-none focus:ring-2 focus:ring-primary"
				>
					{movie.poster_path ? (
						<img
							className="aspect-auto rounded-[4px] w-full h-full"
							src={`${TMDB_IMAGE_BASE_URL_SD}${movie.poster_path}`}
							alt={`Poster for ${movie.original_title}`}
							width={70}
							height={110}
						/>
					) : (
						<div className="w-full rounded-[4px] flex-col px-2 text-center bg-carbon-200 dark:bg-carbon-dark-200 h-full justify-center flex items-center">
							<p className="text-wrap text-xs font-medium text-neutral-600">
								{movie.original_title}
							</p>
							<p className="text-wrap text-xs font-medium text-neutral-400">
								{movie.release_date
									? new Date(movie.release_date).getFullYear()
									: "????"}
							</p>
						</div>
					)}
				</div>
			</TooltipTrigger>
			<TooltipProvider>
				<TooltipContent className="flex items-center space-x-1">
					<p className="font-medium">{movie.original_title}</p>
					<p className="font-medium text-muted-foreground">
						{movie.release_date
							? new Date(movie.release_date).getFullYear()
							: "????"}
					</p>
				</TooltipContent>
			</TooltipProvider>
		</Tooltip>
	);
}
