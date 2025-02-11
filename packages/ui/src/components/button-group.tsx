"use client";

import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "../utils";
import { Button } from "./button";

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement> & {
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
	orientation?: "horizontal" | "vertical";
};

type ButtonGroupContextProps = {
	size?: ButtonGroupProps["size"];
	disabled?: ButtonGroupProps["disabled"];
	orientation?: ButtonGroupProps["orientation"];
};

export type ButtonGroupElement = HTMLDivElement;

export type ButtonGroupItemProps = Omit<
	React.ComponentPropsWithoutRef<typeof Button>,
	"shape" | "size"
>;

const ButtonGroupContext = React.createContext<ButtonGroupContextProps | null>(
	null,
);

function useButtonGroupContext() {
	const context = React.useContext(ButtonGroupContext);

	if (!context) {
		throw new Error(
			"ButtonGroupItem must be used within a ButtonGroup or ButtonGroup.Root",
		);
	}

	return context;
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
	(
		{
			className,
			orientation = "horizontal",
			disabled = false,
			size = "md",
			children,
			...props
		},
		ref,
	) => (
		<ButtonGroupContext.Provider value={{ orientation, disabled, size }}>
			<div
				ref={ref}
				className={cn(
					"dark:shadow:none inline-flex flex-wrap items-stretch rounded-[9px] shadow-sm",
					orientation === "vertical" && "flex-col",
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</ButtonGroupContext.Provider>
	),
);

const ButtonGroupItem = React.forwardRef<
	HTMLButtonElement,
	ButtonGroupItemProps
>(
	(
		{
			className,
			children,
			asChild,
			before,
			after,
			variant = "primary",
			isIconOnly,
			disabled = false,
			...props
		},
		ref,
	) => {
		const context = useButtonGroupContext();
		const {
			disabled: ctxDisabled,
			orientation = "horizontal",
			size = "md",
		} = context || {};

		const useAsChild = asChild && React.isValidElement(children);
		const Component = useAsChild ? Slot : Button;

		const isIcon = React.useMemo(() => {
			return (
				(before && !after && !children && size) ??
				(after && !before && !children && size) ??
				isIconOnly === true ??
				false
			);
		}, [before, after, children, size, isIconOnly]);
		return (
			<Component
				ref={ref}
				className={cn(
					"flex items-center rounded-none bg-clip-padding focus-visible:z-10 focus-visible:-outline-offset-1",
					"last-of-type:[&+span]:hidden",
					orientation === "horizontal"
						? "first-of-type:rounded-s-lg last-of-type:rounded-e-lg"
						: "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
					size === "sm" && "max-h-[30px]",
					isIcon && size === "sm" && "px-2 py-6px",
					isIcon && size === "md" && "px-3 py-8px",
					className,
				)}
				after={after}
				before={before}
				disabled={disabled ? disabled : ctxDisabled}
				isIconOnly={isIconOnly}
				size={size}
				variant={variant}
				{...props}
			>
				{children}
			</Component>
		);
	},
);

ButtonGroup.displayName = "ButtonGroup";
ButtonGroupItem.displayName = "ButtonGroupItem";

export { ButtonGroup, ButtonGroupItem };
