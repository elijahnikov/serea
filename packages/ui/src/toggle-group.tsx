import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from ".";
import Toggle from "./toggle";

/* ---------------------------------- Types --------------------------------- */
export type ToggleGroupElement = React.ElementRef<
	typeof ToggleGroupPrimitive.Root
>;
export type ToggleGroupProps = React.ComponentPropsWithoutRef<
	typeof ToggleGroupPrimitive.Root
> & {
	/**
	 * The size of the buttons in group.
	 */
	size?: "sm" | "md";
};

export type ToggleGroupItemProps = React.ComponentPropsWithoutRef<
	typeof ToggleGroupPrimitive.Item
> &
	Omit<
		React.ComponentPropsWithoutRef<typeof Toggle>,
		"shape" | "size" | "variant"
	>;

type ToggleGroupContextProps = {
	size?: "sm" | "md";
	disabled?: boolean;
	orientation?: "horizontal" | "vertical";
};

/* --------------------------------- Context -------------------------------- */
const ToggleGroupContext = React.createContext<ToggleGroupContextProps | null>(
	null,
);

/* ------------------------------- Components ------------------------------- */
const ToggleGroup = React.forwardRef<ToggleGroupElement, ToggleGroupProps>(
	(
		{
			className,
			type = "single",
			orientation = "horizontal",
			disabled = false,
			size = "md",
			...otherProps
		},
		ref,
	) => {
		return (
			<ToggleGroupContext.Provider value={{ disabled, orientation, size }}>
				{/* @ts-expect-error requires separate props */}
				<ToggleGroupPrimitive.Root
					ref={ref}
					className={cn(
						"dark:shadow:none inline-flex flex-wrap items-stretch divide-surface-100 rounded-[9px] border border-surface-200 shadow-wg-xs dark:border-surface-100",
						orientation === "vertical" && "flex-col",
						className,
					)}
					type={type}
					{...otherProps}
				/>
			</ToggleGroupContext.Provider>
		);
	},
);

const ToggleGroupItem = React.forwardRef<
	React.ElementRef<typeof ToggleGroupPrimitive.Item>,
	ToggleGroupItemProps
>(({ asChild, className, children, ...otherProps }, ref) => {
	const context = React.useContext(ToggleGroupContext);
	const { size, disabled, orientation } = context ?? {};

	return (
		<ToggleGroupPrimitive.Item
			asChild={true}
			ref={ref}
			disabled={disabled}
			{...otherProps}
		>
			<Toggle
				asChild={asChild}
				className={cn(
					"flex items-center rounded-none border bg-clip-padding focus-visible:z-10 focus-visible:-outline-offset-1 data-[state=on]:bg-surface-50",
					className,
					orientation === "horizontal"
						? "first-of-type:rounded-s-lg last-of-type:rounded-e-lg"
						: "first-of-type:rounded-t-lg last-of-type:rounded-b-lg",
				)}
				variant="transparent"
				size={size}
				shape="rounded"
			>
				{children}
			</Toggle>
		</ToggleGroupPrimitive.Item>
	);
});

ToggleGroup.displayName = "ToggleGroup";
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
