"use client";

import type { VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "../utils";
import { Button, type ButtonProps } from "./button";
import Loading, { type loadingVariants, Spinner } from "./loading";

export interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
  spinnerSize?: VariantProps<typeof loadingVariants>["size"];
}

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, className, spinnerSize, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        {...props}
        disabled={props.disabled ? props.disabled : loading}
        className={cn(className, "relative")}
      >
        <span className={cn(loading ? "opacity-0" : "")}>{children}</span>
        {loading ? (
          <div className="absolute inset-0 grid place-items-center">
            <Loading size={spinnerSize} type="spinner" color="secondary" />
          </div>
        ) : null}
      </Button>
    );
  },
);

LoadingButton.displayName = "LoadingButton";

export { LoadingButton };
