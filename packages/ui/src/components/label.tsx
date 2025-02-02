import * as LabelPrimitive from "@radix-ui/react-label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import { InfoIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../utils/cn";

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
		tooltip?: React.ReactNode;
		required?: boolean;
		disabled?: boolean;
	} & { children: React.ReactNode }
>(({ className, tooltip, children, required, disabled, ...props }, ref) => {
	const tooltipJsx = (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger disabled={disabled}>
					<InfoIcon className="size-4 stroke-[1.5px]" />
				</TooltipTrigger>
				<TooltipContent>
					<span>{tooltip}</span>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);

	const innerContent = (
		<span className="flex items-center gap-1">
			{children}
			{required && <span className="text-red-500">*</span>}
			{tooltip && tooltipJsx}
		</span>
	);
	return (
		<div className="flex items-center gap-2">
			<LabelPrimitive.Root
				ref={ref}
				className={cn(
					disabled && "opacity-50",
					"text-sm font-medium",
					className,
				)}
				{...props}
			>
				{innerContent}
			</LabelPrimitive.Root>
		</div>
	);
});

export { Label };
