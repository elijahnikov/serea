import * as React from "react";
import { UserIcon } from "@iconicicons/react";
import * as Primitive from "@radix-ui/react-avatar";
import type { VariantProps } from "cva";

import SereaIcon from "./serea-icon";

import {
	cn,
	isReactElement,
	getInitials,
	getElementFromHash,
	stringToHash,
} from ".";
import { cva } from "cva";
import { ClassValue } from "class-variance-authority/types";

export const rootClasses =
	"h-10 min-w-10 [--wg-notification-size:10px] relative inline-flex aspect-square shrink-0 items-center wg-antialiased";

export const statusClasses =
	"absolute right-0 bottom-0 aspect-square bg-wg-gray-300 h-[var(--wg-notification-size,10px)] rounded-full ring-background";

export const notificationClasses =
	"absolute right-0 top-0 aspect-square h-[var(--wg-notification-size,10px)] rounded-full ring-background";

export const avatarVariants = cva({
	base: rootClasses,
	variants: {
		size: {
			xxs: "h-4 min-w-4 text-xxs [--wg-notification-size:4px]",
			xs: "h-6 min-w-6 text-xs [--wg-notification-size:6px]",
			sm: "h-8 min-w-8 text-sm [--wg-notification-size:8px]",
			md: "h-10 min-w-10 text-base [--wg-notification-size:10px]",
			lg: "h-12 min-w-12 text-lg [--wg-notification-size:12px]",
			xl: "h-14 min-w-14 text-xl [--wg-notification-size:14px]",
			"2xl": "h-16 min-w-16 text-2xl [--wg-notification-size:16px]",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export const fallbackVariants = cva({
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

export const statusVariants = cva({
	base: statusClasses,
	variants: {
		status: {
			primary: "bg-primary",
			gray: "bg-wg-gray",
			green: "bg-wg-green",
			yellow: "bg-wg-yellow",
			red: "bg-wg-red",
		},
	},
	defaultVariants: {
		status: "gray",
	},
});

export const notificationVariants = cva({
	base: notificationClasses,
	variants: {
		notification: {
			primary: "bg-primary",
			gray: "bg-wg-gray",
			green: "bg-wg-green",
			yellow: "bg-wg-yellow",
			red: "bg-wg-red",
		},
	},
	defaultVariants: {
		notification: "gray",
	},
});

/* ---------------------------------- Types --------------------------------- */
export type AvatarElement =
	| React.ElementRef<typeof Primitive.Image>
	| HTMLSpanElement;

type AvatarVariantProps = VariantProps<typeof statusVariants> &
	VariantProps<typeof notificationVariants> &
	VariantProps<typeof avatarVariants> &
	VariantProps<typeof fallbackVariants>;

type BaseAvatarProps = {
	initials?: string;
};

export type AvatarProps = React.ComponentPropsWithoutRef<
	typeof Primitive.Image
> &
	BaseAvatarProps &
	AvatarVariantProps & {
		delayMs?: number;
	};

/* ------------------------------- Components ------------------------------- */
const AvatarRoot = React.forwardRef<
	React.ElementRef<typeof Primitive.Root>,
	React.ComponentPropsWithoutRef<typeof Primitive.Root>
>(({ className, ...otherProps }, ref) => (
	<Primitive.Root
		ref={ref}
		className={cn(rootClasses, className)}
		{...otherProps}
	/>
));

const AvatarImage = React.forwardRef<
	React.ElementRef<typeof Primitive.Image>,
	React.ComponentPropsWithoutRef<typeof Primitive.Image>
>(({ className, ...otherProps }, ref) => (
	<Primitive.Image
		ref={ref}
		className={cn(
			"aspect-square w-full grow rounded-full object-cover object-center",
			className,
		)}
		{...otherProps}
	/>
));

const AvatarStatus = React.forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<"span"> & {
		ring?: 1 | 2;
	}
>(({ className, ring, ...otherProps }, ref) => {
	const ringSize = ring === 1 ? "ring-1" : "ring-2";

	return (
		<span
			ref={ref}
			className={cn(statusClasses, "bg-wg-gray", ringSize, className)}
			{...otherProps}
		/>
	);
});

const AvatarNotification = React.forwardRef<
	HTMLSpanElement,
	React.ComponentPropsWithoutRef<"span"> & {
		ring?: 1 | 2;
	}
>(({ className, ring, ...props }, ref) => {
	const ringSize = ring === 1 ? "ring-1" : "ring-2";

	return (
		<span
			ref={ref}
			className={cn(notificationClasses, "bg-wg-gray", ringSize, className)}
			{...props}
		/>
	);
});

const AvatarFallback = React.forwardRef<
	React.ElementRef<typeof Primitive.Fallback>,
	React.ComponentPropsWithoutRef<typeof Primitive.Fallback>
>(({ className, ...otherProps }, ref) => (
	<Primitive.Fallback
		ref={ref}
		className={cn(
			"flex aspect-square grow items-center justify-center rounded-full bg-surface-100 text-surface-400 dark:bg-neutral-800",
			className,
		)}
		{...otherProps}
	/>
));

const AvatarWedges = React.forwardRef<AvatarElement, AvatarProps>(
	(props, ref) => {
		const {
			alt,
			children,
			className,
			initials,
			notification,
			size = "md",
			src,
			delayMs,
			status,
			style,
			...otherProps
		} = props;

		const bgColor = React.useMemo(() => {
			// Get a random color for initial variant.
			const randomColors = [
				"bg-wg-blue",
				"bg-wg-pink",
				"bg-wg-purple",
				"bg-wg-green",
				"bg-wg-orange",
				"bg-wg-yellow",
				"bg-wg-red",
			];

			const identifier =
				(initials ?? "") +
				(size ?? "") +
				(status ?? "") +
				(notification ?? "") +
				(src ?? "");
			const color = getElementFromHash(stringToHash(identifier), randomColors);

			return color ?? !randomColors[0];
		}, [initials, notification, size, src, status]);

		return (
			<AvatarRoot
				className={cn(
					avatarVariants({ size }),
					!src && !initials && children ? "aspect-auto w-auto" : "",
				)}
			>
				{/* Show image if available */}
				{src && (
					<AvatarImage
						ref={ref as React.RefObject<HTMLImageElement>}
						alt={alt}
						className={className}
						src={src}
						style={style}
						{...otherProps}
					/>
				)}

				{/* Allow children to be used as fallback */}
				{children && (
					<AvatarFallback
						ref={ref}
						aria-label={alt}
						delayMs={delayMs}
						asChild={isReactElement(children)}
						className={className}
						style={style}
					>
						{children}
					</AvatarFallback>
				)}

				{/* Show Lemon Squeezy icon until image is loaded, 
          only if children fallback is not set */}
				{!children && src && !initials && (
					<AvatarFallback
						aria-label={alt}
						className={cn("text-surface-300", className)}
						style={style}
					>
						<SereaIcon
							aria-hidden="true"
							className={cn(
								fallbackVariants({ size }),
								"mr-[-4.5%] w-auto fill-current stroke-none",
							)}
						/>
					</AvatarFallback>
				)}

				{/* Initials */}
				{!children && initials && (
					<Primitive.Fallback
						ref={ref}
						aria-label={alt}
						className={cn(
							"flex aspect-square grow select-none items-center justify-center rounded-full uppercase text-white",
							bgColor,
							className,
						)}
						style={style}
						{...otherProps}
					>
						{getInitials(initials)}
					</Primitive.Fallback>
				)}

				{/* Fallback */}
				{!children && !src && !initials && (
					<AvatarFallback
						ref={ref}
						aria-label={alt}
						className={className}
						role="img"
						style={style}
						{...otherProps}
					>
						<UserIcon className={fallbackVariants({ size })} />
					</AvatarFallback>
				)}

				{/* Status and Notification */}
				{status && (
					<AvatarStatus
						className={statusVariants({ status })}
						ring={size === "xxs" ? 1 : 2}
					/>
				)}

				{notification && (
					<AvatarNotification
						className={notificationVariants({ notification })}
						ring={size === "xxs" ? 1 : 2}
					/>
				)}
			</AvatarRoot>
		);
	},
);

AvatarWedges.displayName = "Avatar";
AvatarRoot.displayName = "AvatarRoot";
AvatarFallback.displayName = Primitive.Fallback.displayName;
AvatarImage.displayName = "AvatarImage";
AvatarNotification.displayName = "AvatarNotification";
AvatarStatus.displayName = "AvatarStatus";

const Avatar = Object.assign(AvatarWedges, {
	Fallback: AvatarFallback,
	Image: AvatarImage,
	Notification: AvatarNotification,
	Root: AvatarRoot,
	Status: AvatarStatus,
});

export default Avatar;
