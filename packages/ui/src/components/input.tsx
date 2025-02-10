import * as React from "react";
import { cn } from "../utils";
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
			prefix,
			suffix,
			helperText,
			...props
		},
		ref,
	) => {
		return (
			<div className={cn("flex flex-col", label ? "gap-2" : "gap-0")}>
				{label && (
					<Label tooltip={tooltip} required={required} disabled={disabled}>
						{label}
					</Label>
				)}
				{!label && required && <span className="text-red-500">*</span>}
				<div
					aria-disabled={disabled}
					className="flex h-9 w-full rounded-lg border-0 dark:border aria-disabled:cursor-not-allowed bg-input shadow-overlay dark:shadow-sm-dark aria-disabled:opacity-50 px-3 py-1 text-sm transition-colors placeholder:text-secondary-foreground/50 "
				>
					{prefix && (
						<div className="pr-2 dark:text-carbon-900 text-secondary-foreground/75 w-max whitespace-nowrap flex items-center justify-center border-r -my-1">
							{prefix}
						</div>
					)}
					<input
						type={type}
						disabled={disabled}
						className={cn(
							"focus-visible:outline-none bg-transparent w-full disabled:cursor-not-allowed focus-visible:ring-0 focus-visible:ring-ring placeholder:text-secondary-foreground/50",
							prefix && "pl-2",
							suffix && "pr-2",
							className,
						)}
						ref={ref}
						{...props}
					/>
					{suffix && (
						<div className="pl-3 dark:text-carbon-900 text-secondary-foreground/75 w-max whitespace-nowrap flex items-center justify-center border-l -my-1">
							{suffix}
						</div>
					)}
				</div>
				{helperText && (
					<div className="text-xs text-secondary-foreground">{helperText}</div>
				)}
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
