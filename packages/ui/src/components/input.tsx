import * as React from "react";

import { cn } from "@serea/ui/cn";
import { Label } from "./label";

export type InputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"prefix" | "suffix"
> & {
	label?: string;
	required?: boolean;
	tooltip?: React.ReactNode;
	disabled?: boolean;
	prefix?: React.ReactNode;
	suffix?: React.ReactNode;
	helperText?: React.ReactNode;
};
const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className,
			type,
			disabled = false,
			label,
			required,
			tooltip,
			helperText,
			prefix,
			suffix,
			...props
		},
		ref,
	) => {
		return (
			<div className={cn("flex w-full flex-col", label ? "gap-2" : "gap-0")}>
				{label && (
					<Label tooltip={tooltip} required={required} disabled={disabled}>
						{label}
					</Label>
				)}
				{!label && required && <span className="text-red-500">*</span>}
				<div
					className="flex h-9 w-full rounded-md border border-stone-200/60 bg-stone-100 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-within:ring-1 focus-within:ring-stone-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
					aria-disabled={disabled}
				>
					{prefix && (
						<div className="pr-2 rounded-l-md pl-3 text-muted-foreground w-max whitespace-nowrap bg-white flex items-center justify-center border-r border-stone-200/60 -my-1">
							{prefix}
						</div>
					)}
					<input
						type={type}
						className={cn(
							"focus-visible:outline-none px-3 bg-transparent w-full disabled:cursor-not-allowed focus-visible:ring-0 focus-visible:ring-ring placeholder:text-muted-foreground",
							prefix && "pl-2",
							suffix && "pr-2",
							className,
						)}
						ref={ref}
						{...props}
					/>
					{suffix && (
						<div className="pl-3 text-muted-foreground w-max whitespace-nowrap flex items-center justify-center border-l border-stone-200/60 -my-1">
							{suffix}
						</div>
					)}
				</div>
				{helperText && (
					<span className="-mt-1 ml-1 text-xs text-muted-foreground">
						{helperText}
					</span>
				)}
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
