import type { RouterInputs } from "@serea/api";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { Plus } from "lucide-react";
import MovieSearch from "../../../create/movie-search";
import { nanoid } from "nanoid";
import { Button } from "@serea/ui/button";

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
					<Button
						before={<Plus />}
						className="w-full focus:outline-none focus:ring-0"
						variant={"outline"}
					>
						Add movie
					</Button>
				</PopoverTrigger>
				<PopoverContent className="min-w-[400px]">
					<MovieSearch
						callback={async (movie) => {
							const newId = nanoid();
							addMovie({
								...movie,
							});
							addEntry({
								id: newId,
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
