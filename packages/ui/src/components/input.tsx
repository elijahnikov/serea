import * as React from "react";
import { cn } from "../utils";
import Label from "./label";

/* ---------------------------------- Types --------------------------------- */
export type InputElement = HTMLInputElement;
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  destructive?: boolean;
  description?: React.ReactNode;
  label?: React.ReactNode;
  helperText?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  tooltip?: React.ReactNode;
};

/* -------------------------------- Component ------------------------------- */
const Input = React.forwardRef<InputElement, InputProps>(
  (
    {
      className,
      description,
      destructive,
      disabled,
      helperText,
      id,
      label,
      required,
      tooltip,
      ...otherProps
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const elId = id ?? generatedId;
    const ariaInvalid = otherProps["aria-invalid"] ?? destructive;

    return (
      <div className="flex w-full flex-col gap-2 wg-antialiased">
        <Label
          description={description}
          disabled={disabled}
          htmlFor={elId}
          id={`${elId}__label`}
          required={required}
          tooltip={tooltip}
        >
          {label}
        </Label>

        <div className="relative flex items-center">
          <input
            ref={ref}
            aria-describedby={helperText ? `${elId}__describer` : undefined}
            aria-invalid={ariaInvalid}
            aria-labelledby={label ? `${elId}__label` : undefined}
            className={cn(
              "flex grow rounded-lg border px-4 py-2 text-sm leading-6 shadow-wg-xs transition-colors duration-100 placeholder:text-surface-500",
              "focus:outline-none focus:ring-0",
              !disabled &&
                "bg-background text-surface-900 hover:border-surface-300 dark:hover:border-surface-200",
              disabled &&
                "cursor-not-allowed bg-surface-50 text-surface-300 placeholder:text-surface-300 dark:bg-white/5 dark:text-surface-200 dark:placeholder:text-surface-200",
              ariaInvalid &&
                "border-destructive outline-destructive hover:border-destructive dark:hover:border-destructive",
              !ariaInvalid && "border-surface-200 dark:border-surface-100",
              className,
            )}
            disabled={disabled}
            id={elId}
            {...otherProps}
          />
        </div>

        <Label.Helper
          aria-invalid={ariaInvalid}
          disabled={disabled}
          id={`${elId}__describer`}
        >
          {helperText}
        </Label.Helper>
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
