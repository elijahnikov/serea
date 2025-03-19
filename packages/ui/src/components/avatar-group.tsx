import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils";
import { Avatar, type AvatarElement, type AvatarProps } from "./avatar";

const defaultAvatarGroupClasses =
	"antialiased flex flex-wrap items-center gap-y-1 -space-x-3";

const avatarGroupVariants = cva(defaultAvatarGroupClasses, {
	variants: {
		size: {
			xs: "-space-x-1",
			sm: "-space-x-2",
			md: "-space-x-3",
			lg: "-space-x-4",
			xl: "-space-x-5",
			"2xl": "-space-x-6",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

const AvatarGroupItem = React.forwardRef<
	AvatarElement,
	React.ComponentPropsWithoutRef<typeof Avatar>
>(({ children, className, initials, ...otherProps }, ref) => {
	return (
		<Avatar
			ref={ref}
			className={cn(
				"ring-1 dark:shadow-sm-dark ring-carbon-500 dark:ring-carbon-dark-500 backdrop-blur-3xl",
				className,
			)}
			initials={initials}
			{...otherProps}
		>
			{children}
		</Avatar>
	);
});

type AvatarMoreLabelProps = React.HTMLAttributes<HTMLDivElement> & {
	label?: React.ReactNode;
	size: AvatarProps["size"];
};

const AvatarMoreLabel = React.forwardRef<AvatarElement, AvatarMoreLabelProps>(
	({ size, className, label, children, ...otherProps }, ref) => {
		return (
			<Avatar
				ref={ref}
				asChild={React.isValidElement(children)}
				className={cn(
					"aspect-auto h-full w-full bg-card p-2 font-medium text-secondary-foreground dark:text-white",
					className,
				)}
				size={size}
				{...otherProps}
			>
				{!children && <span>{label}</span>}
				{children}
			</Avatar>
		);
	},
);

type BaseAvatarGroupProps = {
	moreLabel?: React.ReactNode;
	reverseOrder?: boolean;
};

export type AvatarGroupProps = Omit<
	React.ComponentPropsWithoutRef<"div">,
	"size"
> &
	BaseAvatarGroupProps &
	VariantProps<typeof avatarGroupVariants>;

const AvatarGroupRoot = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...otherProps }, ref) => (
	<div
		ref={ref}
		className={cn(defaultAvatarGroupClasses, className)}
		{...otherProps}
	>
		{children}
	</div>
));

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
	({ moreLabel, size, children, className, ...props }, ref) => {
		return (
			<AvatarGroupRoot
				ref={ref}
				className={cn(avatarGroupVariants({ size }), className)}
				{...props}
			>
				{React.Children.map(children, (child) => {
					if (React.isValidElement(child)) {
						return React.cloneElement(child, { size } as Partial<AvatarProps>);
					}
					return child;
				})}
				{moreLabel && <AvatarMoreLabel label={moreLabel} size={size} />}
			</AvatarGroupRoot>
		);
	},
);

AvatarGroupItem.displayName = "AvatarGroupItem";
AvatarMoreLabel.displayName = "AvatarMoreLabel";

export { AvatarGroup, AvatarGroupItem, AvatarMoreLabel };
