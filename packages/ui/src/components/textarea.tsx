import * as React from "react";

import { cn } from "@serea/ui/cn";
import { Label } from "./label";

export type InputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
	label?: string;
	optional?: boolean;
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
			optional,
			...props
		},
		ref,
	) => {
		return (
			<div className={cn("flex flex-col", label ? "gap-2" : "gap-0")}>
				{label && (
					<Label tooltip={tooltip} required={required} disabled={disabled}>
						{label}{" "}
						{optional && (
							<span className="text-muted-foreground/80 text-sm">optional</span>
						)}
					</Label>
				)}
				{!label && required && <span className="text-red-500">*</span>}
				<textarea
					className={cn(
						"flex min-h-[60px] w-full rounded-md border border-stone-200/60 bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-200 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
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
Textarea.displayName = "Textarea";

export { Textarea };
