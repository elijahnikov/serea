import type { RouterOutputs } from "@serea/api";
import { Badge } from "@serea/ui/badge";

export default function WatchlistTags({
	tags,
}: {
	tags: Pick<RouterOutputs["watchlist"]["get"], "tags">;
}) {
	if (tags.tags.length === 0) return null;
	return (
		<div>
			<p className="text-xs font-mono text-carbon-900">TAGS</p>
			<div className="flex mt-2 flex-wrap max-w-[200px] gap-2">
				{tags.tags.map((tag) => (
					<Badge key={tag} color="secondary" className="px-2 py-1 rounded-md">
						{tag}
					</Badge>
				))}
			</div>
		</div>
	);
}
