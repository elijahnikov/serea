import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { type VariantProps, cva } from "cva";
import * as React from "react";
import { cn, isReactElement } from "../utils";

const TOOLTIP_ANIMATION_CLASSES = [
	// transform-origin
	"origin-[var(--radix-popper-transform-origin)]",

	// state animations
	"data-[side=bottom]:animate-wg-fade-in-down data-[side=top]:animate-wg-fade-in-up data-[side=left]:animate-wg-fade-in-left data-[side=right]:animate-wg-fade-in-right data-[state=closed]:animate-wg-fade-out",

	// instant-open
	"data-[state=instant-open]:!animate-none",
];

/* -------------------------------- Variants -------------------------------- */
const tooltipVariant = cva({
	base: "z-50 rounded-md text-start dark:text-black text-white wg-antialiased",
	variants: {
		size: {
			sm: "max-w-xs px-3 py-2 text-xs",
			md: "max-w-[350px] p-4 text-sm",
		},
		color: {
			primary: "text-white wg-bg-secondary",
			secondary: "text-white wg-bg-secondary dark:text-secondary-900",
			soft: "border border-transparent text-wg-gray-700 shadow-wg-overlay wg-bg-white dark:border-surface dark:bg-neutral-800 dark:text-surface-700 dark:shadow-none",
		},
	},
	defaultVariants: {
		size: "sm",
		color: "primary",
	},
});

export type IconProps = {
	color?: string;
	size?: number;
	title?: string;
} & React.SVGProps<SVGSVGElement>;

const TippyIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
	const { size = 24, title, ...rest } = props;
	const titleId = title
		? `wg-${Date.now()}-${Math.floor(Math.random() * 10000)}`
		: undefined;

	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			ref={ref}
			aria-labelledby={titleId}
			fill="currentColor"
			height="8"
			width={size}
			{...rest}
			viewBox="0 0 24 8"
		>
			{title && <title id={titleId}>{title}</title>}
			<path d="M4.55486 0H19.586C17.0713 0 14.5567 3.5825 13.1681 5.95276C12.7242 6.71045 11.4928 6.67361 11.0817 5.89769C9.82569 3.52743 7.46729 0 4.55486 0Z" />
		</svg>
	);
});

const InfoIcon = React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
	const { size = 24, title, ...rest } = props;
	const titleId = title
		? `wg-${Date.now()}-${Math.floor(Math.random() * 10000)}`
		: undefined;

	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			ref={ref}
			aria-labelledby={titleId}
			fill="currentColor"
			height={size}
			viewBox="0 0 24 24"
			width={size}
			{...rest}
		>
			{title && <title id={titleId}>{title}</title>}
			<path
				clipRule="evenodd"
				d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 9C11 8.44772 11.4477 8 12 8C12.5523 8 13 8.44772 13 9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9ZM12 12C12.5523 12 13 12.4477 13 13V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V13C11 12.4477 11.4477 12 12 12Z"
				fillRule="evenodd"
			/>
		</svg>
	);
});

const TooltipTrigger = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger>
>((props, ref) => {
	const {
		children,
		asChild = children ? isReactElement(children) : children === undefined,
		className,
		onClick,
		...otherProps
	} = props;
	return (
		<TooltipPrimitive.Trigger ref={ref} asChild={asChild} {...otherProps}>
			{children ? (
				children
			) : (
				<span
					className={cn(
						onClick ? "cursor-pointer" : "cursor-default",
						"inline-flex items-center justify-center rounded-full text-surface-200 transition-colors duration-100 focus:outline-none focus-visible:text-primary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary data-[state=delayed-open]:text-primary data-[state=instant-open]:!transition-none dark:hover:text-primary dark:focus-visible:text-primary [&:not([data-state=closed])]:text-primary",
						className,
					)}
					onClick={onClick}
					role={onClick ? "button" : undefined}
					tabIndex={0}
					onKeyDown={(e: React.KeyboardEvent) => {
						// Allow the action on "Enter" and "Space" key
						if (e.key === "Enter" || e.key === " ") {
							if (onClick) {
								onClick(
									e as unknown as React.MouseEvent<
										HTMLButtonElement,
										MouseEvent
									>,
								);
							}
						}
					}}
				>
					<InfoIcon className="scale-100" />
				</span>
			)}
		</TooltipPrimitive.Trigger>
	);
});

const TooltipArrow = React.forwardRef<
	React.ElementRef<typeof TooltipPrimitive.Arrow>,
	React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow>
>(
	(
		{
			className,
			children,
			asChild = children ? isReactElement(children) : children === undefined,
			width = 24,
			height = 8,
			...props
		},
		ref,
	) => {
		return (
			<TooltipPrimitive.Arrow
				ref={ref}
				asChild={asChild}
				className={cn(className)}
				height={height}
				viewBox="0 0 24 8"
				width={width}
				{...props}
			>
				{children ? children : <TippyIcon className="text-background" />}
			</TooltipPrimitive.Arrow>
		);
	},
);

/* ---------------------------- Tooltip Provider ---------------------------- */
type TooltipProviderElement = React.ElementRef<
	typeof TooltipPrimitive.Provider
>;
type TooltipProviderProps = React.ComponentPropsWithRef<
	typeof TooltipPrimitive.Provider
>;

const TooltipProvider = React.forwardRef<
	TooltipProviderElement,
	TooltipProviderProps
>(
	// This component does not expect ref.
	(props, _ref) => {
		const { delayDuration = 200, skipDelayDuration = 0, ...otherProps } = props;

		return (
			<TooltipPrimitive.Provider
				delayDuration={delayDuration}
				skipDelayDuration={skipDelayDuration}
				{...otherProps}
			/>
		);
	},
);

/* ------------------------------ Tooltip Root ------------------------------ */
type TooltipRootElement = React.ElementRef<typeof TooltipPrimitive.Root>;
type TooltipRootProps = React.ComponentPropsWithRef<
	typeof TooltipPrimitive.Root
>;

const TooltipRoot = React.forwardRef<TooltipRootElement, TooltipRootProps>(
	// This component does not expect ref.
	(props, _ref) => {
		const { delayDuration = 200, ...otherProps } = props;

		return (
			<TooltipPrimitive.Root delayDuration={delayDuration} {...otherProps} />
		);
	},
);

/* ----------------------------- Tooltip Content ---------------------------- */
type TooltipContentElement = React.ElementRef<typeof TooltipPrimitive.Content>;
type TooltipContentProps = Omit<
	React.ComponentPropsWithRef<typeof TooltipPrimitive.Content>,
	"content"
> & {
	/**
	 * Whether to animate the tooltip when it opens/closes
	 */
	animation?: boolean;

	/**
	 * Whether to show an arrow pointing to the target element
	 */
	arrow?: boolean;

	/**
	 * The content to display inside the tooltip
	 */
	content?: React.ReactNode;
} & VariantProps<typeof tooltipVariant>;

const TooltipContent = React.forwardRef<
	TooltipContentElement,
	TooltipContentProps
>((props, ref) => {
	const {
		alignOffset = -12,
		animation = true,
		arrow = true,
		arrowPadding = 12,
		children,
		content,
		className,
		collisionPadding = 12,
		sideOffset = 2,

		// variants
		size,
		color,

		...otherProps
	} = props;

	return (
		<TooltipPrimitive.Content
			ref={ref}
			alignOffset={alignOffset}
			arrowPadding={arrowPadding}
			className={cn(
				tooltipVariant({ size, color }),
				animation && TOOLTIP_ANIMATION_CLASSES,
				className,
			)}
			collisionPadding={collisionPadding}
			sideOffset={sideOffset}
			{...otherProps}
		>
			{children ?? content}
			{arrow ? <TooltipArrow /> : null}
		</TooltipPrimitive.Content>
	);
});

/* ----------------------------- Tooltip Wedges ----------------------------- */
export type TooltipElement = TooltipContentElement;
type TooltipProps = React.ComponentPropsWithoutRef<
	typeof TooltipPrimitive.Root
> &
	TooltipContentProps;

const Tooltip = React.forwardRef<TooltipElement, TooltipProps>((props, ref) => {
	const {
		// root props
		defaultOpen,
		delayDuration = 200,
		disableHoverableContent,
		onOpenChange,
		open,

		// trigger
		asChild,
		children,
		onClick,

		// content
		...otherProps
	} = props;

	return (
		<TooltipProvider>
			<TooltipRoot
				defaultOpen={defaultOpen}
				delayDuration={delayDuration}
				disableHoverableContent={disableHoverableContent}
				onOpenChange={onOpenChange}
				open={open}
			>
				<TooltipContent ref={ref} {...otherProps} />

				<TooltipTrigger
					asChild={asChild}
					onClick={
						onClick as React.MouseEventHandler<HTMLButtonElement> | undefined
					}
				>
					{children}
				</TooltipTrigger>
			</TooltipRoot>
		</TooltipProvider>
	);
});

const TooltipPortal = TooltipPrimitive.Portal;

export {
	Tooltip,
	TooltipArrow,
	TooltipContent,
	TooltipTrigger,
	TooltipRoot,
	TooltipProvider,
	TooltipPortal,
};
