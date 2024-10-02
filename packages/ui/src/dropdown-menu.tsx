"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import {
	CheckIcon,
	ChevronRightIcon,
	DotFilledIcon,
} from "@radix-ui/react-icons";

import { cn } from "@serea/ui";
import Kbd, { type KbdElement, type KbdProps } from "./kbd";

const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuSubTrigger = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
		inset?: boolean;
	}
>(({ className, inset, children, ...props }, ref) => (
	<DropdownMenuPrimitive.SubTrigger
		ref={ref}
		className={cn(
			"relative flex cursor-pointer select-none items-center gap-2 px-4 py-1 leading-6 text-surface-overlay-foreground outline-none focus:wg-bg-surface-overlay-focus data-[disabled]:pointer-events-none data-[state=open]:bg-surface-overlay-focus data-[disabled]:opacity-40",
			"[&_svg]:opacity-40",
			className,
		)}
		{...props}
	>
		{children}
		{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
		<svg
			className="ms-auto size-6 text-surface-500"
			fill="none"
			height="24"
			viewBox="0 0 24 24"
			width="24"
		>
			<path
				d="M10.75 8.75L14.25 12L10.75 15.25"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
		</svg>
	</DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubTrigger.displayName =
	DropdownMenuPrimitive.SubTrigger.displayName;

const DropdownMenuSubContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent> & {
		inset?: boolean;
	}
>(
	(
		{
			className,
			collisionPadding = 8,
			sideOffset = -4,
			alignOffset = -9,
			inset = false,
			...props
		},
		ref,
	) => (
		<DropdownMenuPrimitive.SubContent
			ref={ref}
			alignOffset={alignOffset}
			className={cn(
				// state animations
				"data-[side=bottom]:animate-wg-fade-in-down data-[side=left]:animate-wg-fade-in-left data-[side=right]:animate-wg-fade-in-right data-[side=top]:animate-wg-fade-in-up data-[state=closed]:animate-wg-fade-out",
				// base styles
				"z-50 flex min-w-36 origin-[var(--radix-popper-transform-origin)] flex-col gap-2 rounded-lg bg-surface-overlay py-2 shadow-wg-overlay dark:border dark:border-surface dark:shadow-none",
				// has checkbox or radio item - offset start padding
				inset && "[--wg-offset-padding-left:34px]",
				className,
			)}
			collisionPadding={collisionPadding}
			sideOffset={sideOffset}
			{...props}
		/>
	),
);
DropdownMenuSubContent.displayName =
	DropdownMenuPrimitive.SubContent.displayName;

const DropdownMenuContent = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content> & {
		inset?: boolean;
	}
>(
	(
		{
			align = "start",
			collisionPadding = 8,
			className,
			inset = false,
			sideOffset = 8,
			...props
		},
		ref,
	) => (
		<DropdownMenuPrimitive.Portal>
			<DropdownMenuPrimitive.Content
				ref={ref}
				align={align}
				collisionPadding={collisionPadding}
				sideOffset={sideOffset}
				className={cn(
					// state animations
					"data-[side=bottom]:animate-wg-fade-in-down data-[side=left]:animate-wg-fade-in-left data-[side=right]:animate-wg-fade-in-right data-[side=top]:animate-wg-fade-in-up",
					// base styles
					"flex origin-[var(--radix-popper-transform-origin)] flex-col gap-2 rounded-lg bg-white py-2 text-sm leading-6 text-surface-900 shadow-wg-overlay wg-antialiased dark:border dark:border-surface dark:bg-neutral-800 dark:text-surface-700 dark:shadow-none",
					// has checkbox or radio item - offset start padding
					inset && "[--wg-offset-padding-left:32px]",
					className,
				)}
				{...props}
			/>
		</DropdownMenuPrimitive.Portal>
	),
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

const DropdownMenuItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Item>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
		inset?: boolean;
		destructive?: boolean;
	}
>(({ className, inset, destructive, ...props }, ref) => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={cn(
			"relative flex cursor-pointer select-none items-center gap-2 px-4 py-1 outline-none focus:bg-surface data-[disabled]:pointer-events-none data-[disabled]:opacity-40 dark:focus:bg-white/5 [&:has(>svg:first-child)]:pl-3",
			!destructive &&
				"text-surface-900 dark:text-surface-700 [&_svg]:text-surface-900 [&_svg]:opacity-40",
			destructive && "text-destructive",
			"pl-[var(--wg-offset-padding-left,1rem)]",
			className,
		)}
		{...props}
	/>
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuCheckboxItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem> & {
		destructive?: boolean;
	}
>(({ className, children, checked, destructive, ...props }, ref) => (
	<DropdownMenuPrimitive.CheckboxItem
		ref={ref}
		className={cn(
			"wg-dropdown-menu__checkbox-item relative flex cursor-pointer select-none items-center px-4 py-1 pl-[var(--wg-offset-padding-left,1rem)] outline-none focus:bg-surface-overlay-focus data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
			!destructive && "text-surface-overlay-foreground [&_svg]:opacity-40",
			destructive && "text-destructive",
			className,
		)}
		checked={checked}
		{...props}
	>
		<span className="flex items-center justify-center">
			<DropdownMenuPrimitive.ItemIndicator className="flex items-center justify-center">
				<CheckIcon className="absolute left-2" />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName =
	DropdownMenuPrimitive.CheckboxItem.displayName;

const CircleIcon = ({
	className,
	...otherProps
}: React.ComponentProps<"svg">) => (
	// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
	<svg
		{...otherProps}
		className={cn("!opacity-100", className)}
		fill="currentColor"
		height="24"
		stroke="none"
		viewBox="0 0 24 24"
		width="24"
	>
		<circle cx="12" cy="12" fill="currentColor" r="2.5" />
	</svg>
);

const DropdownMenuRadioItem = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem> & {
		destructive?: boolean;
	}
>(({ className, children, destructive, ...props }, ref) => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		className={cn(
			"wg-dropdown-menu__checkbox-item relative flex cursor-pointer select-none items-center px-4 py-1 pl-[var(--wg-offset-padding-left,1rem)] outline-none focus:bg-surface-overlay-focus data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
			!destructive && "text-surface-overlay-foreground [&_svg]:opacity-40",
			destructive && "text-destructive",
			className,
		)}
		{...props}
	>
		<span className="flex items-center justify-center">
			<DropdownMenuPrimitive.ItemIndicator className="flex items-center justify-center">
				<CircleIcon className="absolute left-2" />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>
		{children}
	</DropdownMenuPrimitive.RadioItem>
));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

const DropdownMenuLabel = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Label>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
		inset?: boolean;
	}
>(({ className, inset, ...props }, ref) => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		className={cn(
			"px-2 py-1.5 text-sm font-semibold",
			inset && "pl-8",
			className,
		)}
		{...props}
	/>
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

const DropdownMenuSeparator = React.forwardRef<
	React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
	React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		className={cn("h-px bg-surface-100 dark:bg-white/5", className)}
		{...props}
	/>
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

const DropdownMenuShortcut = React.forwardRef<KbdElement, KbdProps>(
	({ className, ...otherProps }, ref) => {
		return (
			<Kbd
				ref={ref}
				className={cn(
					"shadow-0 ms-auto border-0 bg-transparent p-0 ps-4 text-xs text-surface-500 dark:bg-transparent dark:text-surface-500",
					className,
				)}
				{...otherProps}
			/>
		);
	},
);

DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuGroup,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuRadioGroup,
};
