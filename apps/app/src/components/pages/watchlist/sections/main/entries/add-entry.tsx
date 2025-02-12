import { Button } from "@serea/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { Plus } from "lucide-react";
import MovieSearch from "~/components/common/movie-search";

export default function AddEntry() {
	return (
		<div>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant={"outline"} className="w-full h-[calc(100%-20px)]">
						<div className="flex items-center gap-2 flex-col">
							<Plus className="text-secondary-foreground size-8 stroke-[1.5px]" />
						</div>
						<p className="font-medium text-secondary-foreground text-sm">
							Add entry
						</p>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="min-w-[400px]">
					<MovieSearch
						callback={async (movie) => {
							console.log(movie);
						}}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
