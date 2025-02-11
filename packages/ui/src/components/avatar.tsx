"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { type VariantProps, cva } from "class-variance-authority";
import { UserIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../utils";

export const rootClasses =
	"h-10 min-w-10 relative inline-flex aspect-square shrink-0 items-center antialiased";

export const avatarVariants = cva(rootClasses, {
	variants: {
		size: {
			xxs: "h-5 min-w-5 text-xs",
			xs: "h-6 min-w-6 text-sm",
			sm: "h-8 min-w-8 text-base",
			md: "h-10 min-w-10 text-lg",
			lg: "h-12 min-w-12 text-xl",
			xl: "h-14 min-w-14 text-2xl",
			"2xl": "h-16 min-w-16 text-3xl",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export const fallbackVariants = cva("", {
	variants: {
		size: {
			xxs: "size-3",
			xs: "size-4",
			sm: "size-5",
			md: "size-6",
			lg: "size-7",
			xl: "size-8",
			"2xl": "size-10",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export type AvatarElement =
	| React.ElementRef<typeof AvatarPrimitive.Image>
	| HTMLSpanElement;

type AvatarVariantProps = VariantProps<typeof avatarVariants> &
	VariantProps<typeof fallbackVariants>;

export type AvatarProps = React.ComponentPropsWithoutRef<
	typeof AvatarPrimitive.Image
> &
	AvatarVariantProps & {
		delayMs?: number;
		initials?: string;
	};

const AvatarRoot = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Root
		ref={ref}
		className={cn(rootClasses, className)}
		{...props}
	/>
));
AvatarRoot.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Image>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Image
		ref={ref}
		className={cn(
			"aspect-square border shadow-overlay w-full grow rounded-full object-cover object-center",
			className,
		)}
		{...props}
	/>
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
	React.ElementRef<typeof AvatarPrimitive.Fallback>,
	React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={cn(
			"flex min-h-full bg-carbon-200 text-secondary-foreground min-w-full border shadow-overlay dark:shadow-xs-dark dark:bg-carbon-dark-500 dark:border-secondary items-center justify-center rounded-full",
			className,
		)}
		{...props}
	/>
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const Avatar = React.forwardRef<AvatarElement, AvatarProps>(
	(
		{ size, className, initials, children, alt, style, delayMs, src, ...props },
		ref,
	) => {
		return (
			<AvatarRoot
				className={cn(
					avatarVariants({ size }),
					!src && !initials && children ? "aspect-auto w-auto" : "",
				)}
			>
				{src && (
					<AvatarImage
						ref={ref as React.RefObject<HTMLImageElement>}
						alt={alt}
						className={className}
						src={src}
						style={style}
						{...props}
					/>
				)}

				{children && (
					<AvatarFallback
						ref={ref}
						aria-label={alt}
						delayMs={delayMs}
						asChild={React.isValidElement(children)}
						className={className}
						style={style}
					>
						{children}
					</AvatarFallback>
				)}

				{!children && initials && (
					<AvatarPrimitive.Fallback
						ref={ref}
						aria-label={alt}
						className={cn(
							"flex aspect-square grow select-none items-center justify-center rounded-full uppercase text-white",
							className,
						)}
						style={style}
						{...props}
					>
						{initials}
					</AvatarPrimitive.Fallback>
				)}

				{!children && !src && !initials && (
					<AvatarFallback
						ref={ref}
						aria-label={alt}
						className={cn(className)}
						role="img"
						style={style}
						{...props}
					>
						<UserIcon className={fallbackVariants({ size })} />
					</AvatarFallback>
				)}
			</AvatarRoot>
		);
	},
);
Avatar.displayName = "Avatar";

export { AvatarRoot, AvatarImage, AvatarFallback, Avatar };
