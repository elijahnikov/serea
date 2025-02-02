import * as React from "react";
import { cn } from "../utils/cn";
import { Label } from "./label";

export type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	required?: boolean;
	disabled?: boolean;
	tooltip?: React.ReactNode;
	helperText?: React.ReactNode;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, InputProps>(
	(
		{
			className,
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
			<div className={cn("flex flex-col", label ? "gap-2" : "gap-0")}>
				{label && (
					<Label tooltip={tooltip} required={required} disabled={disabled}>
						{label}
					</Label>
				)}
				{!label && required && <span className="text-red-500">*</span>}
				<textarea
					disabled={disabled}
					className={cn(
						"flex h-16 w-full rounded-lg border-0 dark:border font-medium bg-input shadow-overlay dark:shadow-sm-dark px-3 py-1 text-sm transition-colors placeholder:text-secondary-foreground/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					ref={ref}
					{...props}
				/>
				{helperText && (
					<div className="text-xs text-secondary-foreground">{helperText}</div>
				)}
			</div>
		);
	},
);
Textarea.displayName = "Textarea";

export { Textarea };
