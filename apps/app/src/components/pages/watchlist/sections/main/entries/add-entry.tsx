import type { RouterInputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { PlusIcon } from "lucide-react";
import * as React from "react";
import MovieSearch from "~/components/common/movie-search";

export default function AddEntry({
	addEntry,
	watchlistId,
}: {
	addEntry: (entry: RouterInputs["watchlist"]["addEntry"]) => void;
	watchlistId: string;
}) {
	const [open, setOpen] = React.useState(false);
	return (
		<div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant={"outline"} after={<PlusIcon />}>
						Add entry
					</Button>
				</PopoverTrigger>
				<PopoverContent className="min-w-[400px]">
					<MovieSearch
						callback={async (movie) => {
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
