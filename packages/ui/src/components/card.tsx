import { cn } from "@serea/ui/cn";
import * as React from "react";

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"antialiased border-0 dark:ring-1 ring-inset dark:ring-carbon-dark-400 dark:border-t dark:border-carbon-dark-500 text-sm p-6 border-carbon-400 shadow-overlay rounded-xl",
			"dark:bg-carbon-dark-300 bg-carbon-100",
			className,
		)}
		{...props}
	/>
));
Card.displayName = "Card";

export { Card };
