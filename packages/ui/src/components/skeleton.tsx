import { cn } from "../utils/cn";

const Skeleton = ({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) => {
	return (
		<div
			className={cn(
				"rounded-xl bg-secondary-foreground/10",
				"relative isolate overflow-hidden",
				"before:absolute before:inset-0 before:border-t",
				"before:-translate-x-full",
				"before:animate-[shimmer_2s_infinite]",
				"before:bg-gradient-to-r",
				"before:from-transparent before:via-black/5 dark:before:via-white/5 before:to-transparent",
				className,
			)}
		/>
	);
};

export { Skeleton };
