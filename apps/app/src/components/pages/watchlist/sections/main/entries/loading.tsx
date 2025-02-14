import { Skeleton } from "@serea/ui/skeleton";
import { ListOrderedIcon } from "lucide-react";

export default function LoadingEntries() {
	return (
		<div className="pl-8 pr-14 border-b py-6">
			<div className="flex items-center w-full justify-between text-carbon-900">
				<div className="flex items-center gap-2">
					<ListOrderedIcon className="w-4 h-4" />
					<p className="font-mono text-xs">ENTRIES</p>
				</div>
				<div className="flex items-center gap-2">
					<Skeleton className="h-8 w-[80px]" />
				</div>
			</div>
			<div className="grid mt-4 grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-2">
				{Array.from({ length: 18 }).map((_, index) => (
					<div key={index} className="flex gap-1 flex-col items-center">
						<div className="relative w-full aspect-[2/3]">
							<Skeleton className="rounded-md border-[0.5px] shadow-sm dark:shadow-sm-dark absolute inset-0 h-full w-full" />
						</div>
						<Skeleton className="h-4 w-4" />
					</div>
				))}
			</div>
		</div>
	);
}
