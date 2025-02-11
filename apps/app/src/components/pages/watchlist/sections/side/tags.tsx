import type { RouterOutputs } from "@serea/api";
import { Badge } from "@serea/ui/badge";

export default function WatchlistTags({
	tags,
}: {
	tags: Pick<RouterOutputs["watchlist"]["get"], "tags">;
}) {
	return (
		<div>
			<p className="text-xs font-mono text-carbon-900">TAGS</p>
			<div className="flex mt-2 flex-wrap max-w-[200px] gap-2">
				{tags.tags.map((tag) => (
					<Badge
						key={tag}
						className="bg-carbon-200 text-carbon-900 px-2 py-1 rounded-md"
					>
						{tag}
					</Badge>
				))}
			</div>
		</div>
	);
}
