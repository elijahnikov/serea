import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils";

export const badgeVariants = cva(
	"inline-flex whitespace-nowrap items-center justify-center rounded-md font-medium px-2 py-1.5 antialiased",
	{
		variants: {
			size: {
				sm: "text-sm leading-4",
				md: "text-base leading-5",
				lg: "text-lg leading-6 px-3",
			},
			color: {
				primary:
					"dark:bg-carbon-dark-200 bg-carbon-200 border text-secondary-foreground",
				secondary: "bg-secondary text-secondary-foreground",
				green:
					"dark:bg-green-800 dark:border-green-600 border dark:text-green-200 bg-green-400 border-green-500 text-green-900",
				yellow:
					"dark:bg-yellow-800 dark:border-yellow-700 dark:text-yellow-200 bg-yellow-400 border-yellow-500 text-yellow-900",
				red: "dark:bg-red-800 dark:border-red-600 border dark:text-red-200 bg-red-400 border-red-500 text-red-900",
				purple:
					"dark:bg-purple-800 dark:border-purple-700 dark:text-purple-200 bg-purple-400 border-purple-500 text-purple-900",
				blue: "dark:bg-blue-700 dark:border-blue-500 border ring-1 ring-inset ring-blue-300 dark:ring-blue-800 dark:text-blue-200 bg-blue-400 border-blue-500 text-blue-900",
				indigo:
					"dark:bg-indigo-800 dark:border-indigo-700 dark:text-indigo-200 bg-indigo-400 border-indigo-500 text-indigo-900",
				orange:
					"dark:bg-orange-800 dark:border-orange-700 dark:text-orange-200 bg-orange-400 border-orange-500 text-orange-900",
				pink: "dark:bg-pink-800 dark:border-pink-700 dark:text-pink-200 bg-pink-400 border-pink-500 text-pink-900",
				teal: "dark:bg-teal-800 dark:border-teal-700 dark:text-teal-200 bg-teal-400 border-teal-500 text-teal-900",
				white: "bg-white text-black",
			},
			shape: {
				rounded: "rounded-md",
				pill: "rounded-full",
			},
		},
		defaultVariants: {
			shape: "rounded",
			size: "md",
			color: "primary",
		},
	},
);

export const iconVariants = cva("size-4", {
	variants: {
		color: {
			primary: "text-neutral-400",
			secondary: "text-secondary-foreground",
			green: "text-green-700",
			purple: "text-purple-700",
			indigo: "text-indigo-700",
			orange: "text-orange-700",
			red: "text-red-700",
			pink: "text-pink-700",
			blue: "text-blue-700",
			yellow: "text-yellow-700",
			teal: "text-teal-700",
			white: "text-white",
		},
	},
	compoundVariants: [
		{
			color: [
				"green",
				"purple",
				"orange",
				"primary",
				"secondary",
				"red",
				"pink",
				"indigo",
				"blue",
				"yellow",
				"teal",
				"white",
			],
			class: "text-current",
		},
	],
	defaultVariants: {
		color: "primary",
	},
});

type BaseProps = {
	stroke?: boolean;
	before?: React.ReactElement<HTMLElement>;
	after?: React.ReactElement<HTMLElement>;
};

export type BadgeProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "size"> &
	VariantProps<typeof badgeVariants> &
	BaseProps;

export type BadgeElement = HTMLSpanElement;

const Badge = React.forwardRef<BadgeElement, BadgeProps>((props, ref) => {
	const {
		className,
		children,
		before,
		after,
		stroke = true,
		size = "sm",
		color = "primary",
		shape = "rounded",
		...otherProps
	} = props;

	const renderIcon = (icon: React.ReactElement<HTMLElement>) => {
		const Component = React.isValidElement(icon) ? Slot : "span";
		const classNames = cn(iconVariants({ color }), icon?.props?.className);

		return <Component className={classNames}>{icon}</Component>;
	};
	return (
		<span
			ref={ref}
			{...otherProps}
			className={cn(badgeVariants({ size, color, shape }), className)}
		>
			{before && renderIcon(before)}
			{children && (
				<span
					className={cn(
						size === "md" && "px-1",
						size === "sm" && "px-0.5",
						size === "lg" && "px-1",
					)}
				>
					{children}
				</span>
			)}
			{after && renderIcon(after)}
		</span>
	);
});

Badge.displayName = "Badge";

export { Badge };
