import Badge from "@serea/ui/badge";

export default function Tags({ tags }: { tags: string | null }) {
	if (!tags) return null;

	return (
		<div className="flex flex-col">
			<p className="font-medium dark:text-neutral-400 text-neutral-600 text-sm mb-2">
				Tagged
			</p>
			<div className="flex flex-wrap gap-2">
				{tags.split(",").map((tag, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Badge key={index} stroke className="text-sm text-secondary-500">
						{tag}
					</Badge>
				))}
			</div>
		</div>
	);
}
