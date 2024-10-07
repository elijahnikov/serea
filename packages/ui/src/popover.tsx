"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from ".";
/* ---------------------------------- Types --------------------------------- */
type PopoverElement = React.ElementRef<typeof PopoverPrimitive.Root>;
type PopoverProps = React.ComponentProps<typeof PopoverPrimitive.Root>;

type PopoverContentElement = React.ElementRef<typeof PopoverPrimitive.Content>;
type PopoverContentProps = React.ComponentProps<
	typeof PopoverPrimitive.Content
>;

/* ------------------------------- Components ------------------------------- */

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;
const PopoverPortal = PopoverPrimitive.Portal;
const PopoverAnchor = PopoverPrimitive.Anchor;
const PopoverArrow = PopoverPrimitive.Arrow;
const PopoverClose = PopoverPrimitive.Close;

const PopoverContent = React.forwardRef<
	PopoverContentElement,
	PopoverContentProps
>(
	(
		{
			align = "center",
			className,
			sideOffset = 8,
			collisionPadding = 8,
			...otherProps
		},
		ref,
	) => {
		return (
			<PopoverPrimitive.Content
				ref={ref}
				align={align}
				className={cn(
					// state animations
					"data-[side=top]:wg-animate-fade-in-down data-[side=bottom]:animate-wg-fade-in-up data-[side=left]:animate-wg-fade-in-left data-[side=right]:animate-wg-fade-in-right data-[state=closed]:animate-wg-fade-out",

					// base styles
					"z-50 flex origin-[var(--radix-popper-transform-origin)] flex-col gap-2 rounded-lg bg-white p-4 text-sm leading-6 text-surface-900 shadow-wg-overlay wg-antialiased dark:border dark:border-surface dark:bg-neutral-800 dark:text-surface-700 dark:shadow-none",

					className,
				)}
				collisionPadding={collisionPadding}
				sideOffset={sideOffset}
				{...otherProps}
			/>
		);
	},
);

PopoverContent.displayName = "PopoverContent";

export {
	Popover,
	PopoverTrigger,
	PopoverPortal,
	PopoverAnchor,
	PopoverArrow,
	PopoverClose,
	PopoverContent,
	type PopoverElement,
	type PopoverProps,
};
