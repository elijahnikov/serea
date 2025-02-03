import * as LabelPrimitive from "@radix-ui/react-label";
import { InfoIcon } from "lucide-react";
import * as React from "react";
import { cn } from "../utils/cn";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./tooltip";

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & {
		tooltip?: React.ReactNode;
		required?: boolean;
		disabled?: boolean;
		description?: React.ReactNode;
	} & { children: React.ReactNode }
>(
	(
		{ className, tooltip, children, required, disabled, description, ...props },
		ref,
	) => {
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
			<span className="flex flex-col gap-1">
				<div className="flex items-center gap-1">
					{children}
					{required && <span className="text-red-500">*</span>}
					{tooltip && tooltipJsx}
				</div>
				{description && (
					<span className="text-xs text-gray-500">{description}</span>
				)}
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
	},
);

export { Label };
