import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@serea/ui/cn";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none ring-offset-1 focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-blue-500 text-primary-foreground hover:bg-blue-500/90 active:bg-blue-500/80",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input hover:bg-stone-100 hover:text-accent-foreground",
				secondary:
					"bg-stone-200 text-secondary-foreground hover:bg-stone-200/80 active:bg-stone-300",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-8",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export const iconVariants = cva("text-current m-0 p-0", {
	variants: {
		variant: {
			default: "",
			secondary: "",
			outline: "",
			destructive: "",
			ghost: "",
			link: "",
		},
		size: {
			icon: "size-4",
			default: "size-4",
			sm: "size-5",
			lg: "size-6",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
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
			variant = "default",
			size = "default",
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
					buttonVariants({ variant, size }),
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
