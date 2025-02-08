"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "../utils";

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipTrigger = TooltipPrimitive.Trigger;

const Tooltip = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Root>,
	React.ComponentPropsWithRef<typeof TooltipPrimitive.Root>
>(({ children, ...props }, ref) => {
	const { delayDuration = 200, ...rest } = props;
	return (
		<TooltipPrimitive.Root delayDuration={delayDuration} {...rest}>
			{children}
		</TooltipPrimitive.Root>
	);
});
Tooltip.displayName = TooltipPrimitive.Root.displayName;

const TooltipContent = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, children, sideOffset = 8, ...props }, ref) => (
	<TooltipPrimitive.Content
		ref={ref}
		sideOffset={sideOffset}
		className={cn(
			"z-50 overflow-hidden border-b ring-1 dark:ring-carbon-dark-200 ring-carbon-600 shadow-overlay dark:shadow-sm-dark rounded-lg bg-input px-3 py-1.5 text-sm text-secondary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
			className,
		)}
		{...props}
	>
		{children}
	</TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
