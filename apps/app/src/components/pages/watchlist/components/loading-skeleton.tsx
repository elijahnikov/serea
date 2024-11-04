import { Skeleton } from "@serea/ui/skeleton";
import { MembersProgressLoading } from "./member-progress";

export default function WatchlistLoadingSkeleton() {
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="w-[60vw] max-w-[1000px] pt-8">
				<HeaderSkeleton />
				<div className="flex">
					<div className="w-full pr-8">
						<MainTextSkeleton />
						<FooterActionsSkeleton />
						<EntryGridSkeleton />
					</div>
					<div className="w-[30%] mt-10 min-w-[200px]">
						<TagsSkeleton />
						<MembersProgressLoading />
					</div>
				</div>
			</div>
		</div>
	);
}

function HeaderSkeleton() {
	return (
		<div className="flex items-center justify-between mb-4">
			<Skeleton className="h-10 w-40" />
			<Skeleton className="h-10 w-20" />
		</div>
	);
}

function MainTextSkeleton() {
	return (
		<div className="space-y-2 mb-4">
			<Skeleton className="h-8 w-3/4" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-full" />
			<Skeleton className="h-4 w-[80%]" />
		</div>
	);
}

function FooterActionsSkeleton() {
	return (
		<div className="flex space-x-2 mb-4">
			<Skeleton className="h-8 w-24" />
			<Skeleton className="h-8 w-24" />
		</div>
	);
}

function EntryGridSkeleton() {
	const skeletonItems = Array.from({ length: 10 }, (_, i) => i);

	return (
		<div className="grid grid-cols-5 gap-x-4">
			{skeletonItems.map((item, index) => (
				<div
					key={item}
					className="group items-center relative flex aspect-[2/3] flex-col overflow-hidden rounded-lg"
				>
					<Skeleton className="h-full w-full" />
					<Skeleton className="rounde-sm my-1 h-4 w-4" />
				</div>
			))}
		</div>
	);
}

function TagsSkeleton() {
	return (
		<div className="space-y-2">
			<Skeleton className="h-6 w-20" />
			<div className="flex flex-wrap gap-2">
				{[...Array(5)].map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<Skeleton key={index} className="h-6 w-16 rounded-full" />
				))}
			</div>
		</div>
	);
}
