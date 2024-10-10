import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import { PlusIcon } from "lucide-react";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";
import MovieDropdown from "./movie-dropdown";
import type { RouterOutputs } from "@serea/api";
import Image from "next/image";

export default function ImageGrid({
	entries,
	isOwner = false,
}: {
	entries: NonNullable<RouterOutputs["watchlist"]["get"]>["entries"];
	isOwner?: boolean;
}) {
	return (
		<div className="grid grid-cols-5 gap-x-4">
			<TooltipProvider>
				{entries
					.sort((a, b) => a.order - b.order)
					.map((entry) => (
						<div key={entry.id}>
							<TooltipRoot>
								<TooltipTrigger asChild>
									<div className="flex flex-col items-center">
										{isOwner ? (
											<MovieDropdown entry={entry} />
										) : (
											<Image
												className="rounded-md border-[0.5px] border-surface-200"
												width={0}
												height={0}
												placeholder="blur"
												sizes="100vw"
												style={{ width: "100%", height: "auto" }}
												alt={`Poster for ${entry.movie.title}`}
												src={`${TMDB_IMAGE_BASE_URL_HD}${entry.movie.poster}`}
											/>
										)}
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
						</div>
					))}
				<div className="bg-surface-100 border w-full h-[calc(100%-20px)] rounded-md cursor-pointer flex flex-col justify-center items-center">
					<PlusIcon className="text-neutral-500" size={20} />
				</div>
			</TooltipProvider>
		</div>
	);
}
