import type { RouterInputs } from "@serea/api";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { Plus } from "lucide-react";
import MovieSearch from "../../create/movie-search";

export default function AddEntryButton({
	watchlistId,
	open,
	setOpen,
	addEntry,
	addMovie,
}: {
	watchlistId: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	addMovie: (movie: RouterInputs["movie"]["add"]) => void;
	addEntry: (entry: RouterInputs["watchlist"]["addEntry"]) => void;
}) {
	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<div className="bg-surface-100 border w-full min-h-[150px] h-[calc(100%-20px)] rounded-md cursor-pointer flex flex-col justify-center items-center">
						<Plus />
					</div>
				</PopoverTrigger>
				<PopoverContent className="min-w-[400px]">
					<MovieSearch
						callback={async (movie) => {
							addMovie({
								...movie,
							});
							addEntry({
								contentId: movie.contentId,
								watchlistId: watchlistId,
								content: movie,
							});
							setOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
