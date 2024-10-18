import Badge from "@serea/ui/badge";

export default function WatchlistTags({ tags }: { tags: string | null }) {
	if (!tags) {
		return null;
	}
	return (
		<div>
			<p className="font-medium text-neutral-600 text-sm mb-2">Tagged</p>
			<div className="flex flex-wrap gap-2">
				{tags.split(",").length > 0 &&
					tags.split(",").map((tag, index) => (
						<Badge
							stroke
							className="cursor-pointer font-medium"
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
	);
}
