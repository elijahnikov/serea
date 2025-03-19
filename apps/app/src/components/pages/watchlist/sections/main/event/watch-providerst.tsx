import { AvatarGroup, AvatarGroupItem } from "@serea/ui/avatar-group";
import { PopcornIcon } from "lucide-react";
import { TMDB_IMAGE_BASE_URL_SD } from "~/lib/constants";
import { api } from "~/trpc/react";

export default function WatchProviders({ movieId }: { movieId: number }) {
	const { data, isLoading } = api.tmdb.getWatchProviders.useQuery({
		id: movieId.toString(),
	});

	if (isLoading) return "Loading...";

	return (
		<div className="flex flex-col w-max mb-4 mt-2 text-carbon-900">
			<div className="flex items-center gap-2">
				<PopcornIcon className="w-4 h-4" />
				<p className="font-mono text-xs whitespace-nowrap">WHERE TO WATCH</p>
			</div>

			<div className="ml-5 mt-1">
				<AvatarGroup size="sm">
					{data?.results?.US?.flatrate?.map((provider) => (
						<AvatarGroupItem
							key={provider.provider_id}
							src={`${TMDB_IMAGE_BASE_URL_SD}${provider.logo_path}`}
							alt={provider.provider_name}
							width={20}
							height={20}
						/>
					))}
				</AvatarGroup>
			</div>
		</div>
	);
}
