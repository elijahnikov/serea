"use client";

import { Slot } from "@radix-ui/react-slot";

import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils";

const buttonVariants = cva(
	"select-none cursor-default font-medium animate transition-colors  disabled:pointer-events-none disabled:opacity-50 duration-100 inline-flex items-center justify-center whitespace-nowrap",
	{
		variants: {
			variant: {
				primary:
					"bg-primary active:bg-primary-active hover:bg-primary-hover ring-1 ring-inset ring-primary-ring border-primary-border border-b outline-primary-outline text-white",
				destructive:
					"bg-destructive active:bg-destructive-active hover:bg-destructive-hover ring-1 ring-inset ring-destructive-border  border-b border-destructive-ring outline-destructive-outline text-white",
				black:
					"bg-carbon-dark-100 dark:shadow-sm-dark shadow-xs text-white dark:text-secondary-foreground border-b ring-1 ring-inset ring-carbon-dark-500 border-carbon-dark-300 dark:ring-carbon-dark-400 dark:border-carbon-dark-500 active:bg-carbon-dark-300 hover:bg-carbon-dark-200",
				secondary:
					"bg-secondary hover:bg-secondary-hover active:bg-secondary-active text-secondary-foreground",
				outline:
					"shadow-xs dark:shadow-sm-dark ring-1 ring-inset dark:ring-carbon-dark-500 ring-carbon-dark-500/20 dark:hover:bg-secondary-hover hover:bg-secondary-hover bg-white dark:bg-carbon-dark-300 active:bg-secondary-active text-secondary-foreground",
				transparent:
					"bg-transparent text-secondary-foreground hover:bg-secondary-hover active:bg-secondary-active",
				link: "p-0 hover:underline hover:text-primary underline-offset-4",
			},
			shape: {
				rounded: "rounded-lg",
				square: "rounded-none",
				pill: "rounded-full",
			},
			size: {
				xs: "text-xs px-1 py-1 leading-4",
				sm: "text-sm px-2 py-2 leading-4",
				md: "text-md px-3 py-2 leading-5",
				lg: "text-lg leading-5 px-4 py-2",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "sm",
			shape: "rounded",
		},
	},
);

export const iconVariants = cva("text-current m-0 p-0", {
	variants: {
		variant: {
			primary: "",
			secondary: "",
			outline: "",
			destructive: "",
			transparent: "",
			link: "",
			black: "",
		},
		size: {
			xs: "size-4",
			sm: "size-4",
			md: "size-5",
			lg: "size-6",
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "sm",
	},
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		isIconOnly?: boolean;
		before?: React.ReactElement<HTMLElement>;
		after?: React.ReactElement<HTMLElement>;
	};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			shape = "rounded",
			variant = "primary",
			size = "sm",
			before,
			disabled,
			after,
			isIconOnly = false,
			asChild = false,
			children,
			...props
		},
		ref,
	) => {
		const useAsChild = asChild && React.isValidElement(children);
		const Component = useAsChild ? Slot : "button";

		const renderIcon = (icon: React.ReactElement<HTMLElement>) => {
			const Component = React.isValidElement(icon) ? Slot : "span";

			const iconClasses = cn(
				iconVariants({ size, variant }),
				icon.props?.className,
			);

			return <Component className={iconClasses}>{icon}</Component>;
		};

		const innerContent = useAsChild ? (
			React.cloneElement(children as React.ReactElement, {
				children: (
					<>
						{before ? renderIcon(before) : null}
						{isIconOnly &&
							renderIcon(
								children.props.children as React.ReactElement<HTMLElement>,
							)}
						{!isIconOnly && children.props.children}
						{after ? renderIcon(after) : null}
					</>
				),
			})
		) : (
			<span className="inline-flex items-center">
				{before ? renderIcon(before) : null}
				{React.isValidElement(children) &&
					isIconOnly &&
					renderIcon(children as React.ReactElement<HTMLElement>)}
				{children && !isIconOnly && <span className="px-1">{children}</span>}
				{after ? renderIcon(after) : null}
			</span>
		);

		return (
			<Component
				className={cn(
					buttonVariants({ variant, size, shape }),
					variant === "link" && children && "focus-visible:outline-0",
					className,
				)}
				ref={ref}
				disabled={disabled}
				{...props}
			>
				{innerContent}
			</Component>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
