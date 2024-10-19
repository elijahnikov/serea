import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import type { RouterOutputs } from "@serea/api";
import Image from "next/image";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";

export default function NonMemberImageGrid({
	entries,
}: {
	entries: RouterOutputs["watchlist"]["getEntries"];
}) {
	return (
		<TooltipProvider>
			<div className="grid grid-cols-5 gap-x-4">
				{entries
					?.sort((a, b) => a.order - b.order)
					.map((entry) => (
						<EntryItem key={entry.id} entry={entry} />
					))}
			</div>
		</TooltipProvider>
	);
}

function EntryItem({
	entry,
}: {
	entry: RouterOutputs["watchlist"]["getEntries"][number];
}) {
	return (
		<TooltipRoot>
			<TooltipTrigger asChild>
				<div className="flex flex-col items-center">
					<div className="group">
						<div>
							<Image
								className="rounded-md border-[0.5px] border-surface-200"
								width={0}
								height={0}
								sizes="100vw"
								style={{ width: "100%", height: "auto" }}
								alt={`Poster for ${entry.movie.title}`}
								src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
							/>
						</div>
					</div>
					<p className="font-medium text-neutral-500 text-sm">
						{entry.order + 1}
					</p>
				</div>
			</TooltipTrigger>
			<TooltipContent className="flex items-center space-x-1">
				<p className="font-medium">{entry.movie.title}</p>
				{entry.movie.releaseDate && (
					<p className="font-medium text-neutral-400">
						{new Date(entry.movie.releaseDate).getFullYear()}
					</p>
				)}
			</TooltipContent>
		</TooltipRoot>
	);
}
