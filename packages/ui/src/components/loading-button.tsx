"use client";

import type { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../utils";
import { Button, type ButtonProps } from "./button";
import { Spinner, type spinnerVariants } from "./spinner";

export interface LoadingButtonProps extends ButtonProps {
	loading?: boolean;
	spinnerSize?: VariantProps<typeof spinnerVariants>["size"];
	before?: React.ReactElement<HTMLElement>;
	after?: React.ReactElement<HTMLElement>;
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
	(
		{
			loading = false,
			className,
			spinnerSize,
			children,
			before,
			after,
			...props
		},
		ref,
	) => {
		return (
			<Button
				ref={ref}
				before={before}
				after={after}
				{...props}
				disabled={props.disabled ? props.disabled : loading}
				className={cn(className, "relative")}
			>
				<span className={cn(loading ? "opacity-0" : "")}>{children}</span>
				{loading ? (
					<div className="absolute inset-0 text-current grid place-items-center">
						<Spinner size={spinnerSize} />
					</div>
				) : null}
			</Button>
		);
	},
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
