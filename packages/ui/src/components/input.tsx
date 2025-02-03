import * as React from "react";

import { cn } from "@serea/ui/cn";
import { Label } from "./label";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	required?: boolean;
	tooltip?: React.ReactNode;
	helperText?: React.ReactNode;
	disabled?: boolean;
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
				<input
					type={type}
					className={cn(
						"flex h-9 w-full rounded-md border border-stone-200/60 bg-background px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
						className,
					)}
					ref={ref}
					{...props}
				/>
				{helperText && (
					<span className="text-xs text-muted-foreground">{helperText}</span>
				)}
			</div>
		);
	},
);
Input.displayName = "Input";

export { Input };
