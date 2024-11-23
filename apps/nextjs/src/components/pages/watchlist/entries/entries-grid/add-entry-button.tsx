import type { RouterInputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import type { MovieTableData } from "@serea/validators";
import { Plus } from "lucide-react";
import MovieSearch from "~/components/pages/create/movie-search";

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
	addMovie: (movie: Omit<MovieTableData, "order">) => void;
	addEntry: (entry: RouterInputs["watchlist"]["addEntry"]) => void;
}) {
	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						className="w-full min-h-[175px] h-[calc(100%-20px)] focus:outline-none focus:ring-0"
						variant={"outline"}
					>
						<div className="flex flex-col justify-center items-center">
							<Plus className="text-muted-foreground" />
							<p>Add movie</p>
						</div>
					</Button>
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
