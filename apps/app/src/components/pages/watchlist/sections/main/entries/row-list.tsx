import type { RouterOutputs } from "@serea/api";
import Image from "next/image";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";

export default function RowList({
	entries,
	watchlist,
}: {
	entries: RouterOutputs["watchlist"]["get"]["entries"];
	watchlist: Pick<RouterOutputs["watchlist"]["get"], "id" | "isOwner">;
}) {
	return (
		<div className="flex flex-col gap-4 mt-4">
			{[...entries, ...entries].map((entry, index) => (
				<div
					key={`${entry.contentId}-${index}`}
					className="w-full dark:bg-carbon-dark-100 bg-carbon-100 px-4 py-2 flex items-center gap-4 border rounded-md"
				>
					<div>
						<p className="font-mono text-sm font-medium dark:text-carbon-900/75 text-carbon-dark-500/50">
							#{entry.order + 1}
						</p>
					</div>
					<div className="flex gap-4">
						<Image
							className="rounded-md border-[0.5px] border-surface-200"
							width={52}
							height={78}
							alt={`Poster for ${entry.movie.title}`}
							src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
						/>
						<div>
							<p className="font-medium text-md">{entry.movie.title} </p>
							<p className="font-normal text-sm dark:text-carbon-900/75 text-carbon-dark-500">
								{entry.movie.releaseDate &&
									new Date(entry.movie.releaseDate).getFullYear()}
							</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
