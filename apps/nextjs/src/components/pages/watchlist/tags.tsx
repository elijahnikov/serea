import Badge from "@serea/ui/badge";

export default function Tags({ tags }: { tags: string[] }) {
	return (
		<div className="w-full mt-12 lg:w-1/3 order-first lg:order-last">
			<p className="font-medium dark:text-neutral-400 text-neutral-600 text-sm mb-2">
				Tagged
			</p>
			<div className="flex flex-wrap gap-2">
				{tags.map((tag, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Badge key={index} stroke className="text-sm text-secondary-500">
						{tag}
					</Badge>
				))}
			</div>
		</div>
	);
}
