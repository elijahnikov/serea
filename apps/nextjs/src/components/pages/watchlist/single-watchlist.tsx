import type { RouterOutputs } from "@serea/api";
import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import Badge from "@serea/ui/badge";
import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import MovieDropdown from "./movie-dropdown";
import Image from "next/image";
import { TMDB_IMAGE_BASE_URL_HD } from "~/lib/constants";

export default function SingleWatchlist({
	watchlist,
	isOwner,
}: {
	watchlist: NonNullable<RouterOutputs["watchlist"]["get"]>;
	isOwner: boolean;
}) {
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="w-[60vw] max-w-[1000px] pt-8">
				<div className="flex items-center">
					<AvatarRoot>
						<AvatarWedges
							size="xs"
							src={watchlist.user.image ?? undefined}
							alt={`Navigation profile picture for ${watchlist.user.name}`}
						/>
					</AvatarRoot>
					<p className="text-xs -ml-2">
						List by <span className="font-medium">{watchlist.user.name}</span>
					</p>
				</div>
				<div className="flex">
					<div className="w-full pr-8">
						<p className="font-semibold tracking-tight text-neutral-800 text-balance text-2xl mt-2">
							{watchlist.title}
						</p>
						<p className=" text-neutral-500 mt-2 mb-8 text-md">
							{watchlist.description}
						</p>
						<div className="grid grid-cols-5 gap-x-4">
							<TooltipProvider>
								{watchlist.entries
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
							</TooltipProvider>
						</div>
					</div>
					<div className="w-[30%] mt-10 min-w-[200px]">
						<p className="font-medium text-neutral-600 text-sm mb-2">Tagged</p>
						<div className="flex flex-wrap gap-2">
							{watchlist.tags &&
								watchlist.tags.split(",").length > 0 &&
								watchlist.tags.split(",").map((tag, index) => (
									<Badge
										className="hover:shadow-wg-sm cursor-pointer"
										stroke
										key={`${tag}${
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											index
										}`}
									>
										<p className="text-xs">{tag}</p>
									</Badge>
								))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
