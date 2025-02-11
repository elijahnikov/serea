import type { RouterOutputs } from "@serea/api";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import Image from "next/image";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";

export default function GridList({
	entries,
	watchlist,
}: {
	entries: RouterOutputs["watchlist"]["get"]["entries"];
	watchlist: Pick<RouterOutputs["watchlist"]["get"], "id" | "isOwner">;
}) {
	return (
		<div className="grid mt-4 grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-2">
			<TooltipProvider>
				{[...entries, ...entries].map((entry, index) => (
					<div key={`${entry.contentId}-${index}`}>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex flex-col items-center">
									<div className="relative group">
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
									<p className="font-medium dark:text-neutral-600 text-neutral-400">
										{new Date(entry.movie.releaseDate).getFullYear()}
									</p>
								)}
							</TooltipContent>
						</Tooltip>
					</div>
				))}
			</TooltipProvider>
		</div>
	);
}
