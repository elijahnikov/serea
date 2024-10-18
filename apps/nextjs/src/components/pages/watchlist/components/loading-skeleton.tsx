"use client";

import { Skeleton } from "@serea/ui/skeleton";

export default function WatchlistLoadingSkeleton() {
	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<div className="w-[60vw] max-w-[1000px] pt-8">
				<HeaderSkeleton />
				<div className="flex">
					<div className="w-full pr-8">
						<MainTextSkeleton />
						<FooterActionsSkeleton />
						<ImageGridSkeleton />
					</div>
					<div className="w-[30%] mt-10 min-w-[200px]">
						<TagsSkeleton />
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

function ImageGridSkeleton() {
	return (
		<div className="grid grid-cols-5 gap-4">
			{[...Array(8)].map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<Skeleton key={index} className="aspect-[2/3] w-full rounded-md" />
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
