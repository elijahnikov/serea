import { cn } from ".";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-surface-100", className)}
			{...props}
		/>
	);
}
