import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../utils";

const spinnerVariants = cva("", {
	variants: {
		color: {
			white: "fill-white",
			black: "fill-black",
		},
		size: {
			sm: "h-4 w-4",
			md: "h-6 w-6",
			lg: "h-8 w-8",
			xl: "h-10 w-10",
			"2xl": "h-12 w-12",
		},
	},
	defaultVariants: {
		size: "md",
		color: "white",
	},
});

const Spinner = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof spinnerVariants>
>(({ className, size, color, ...props }, ref) => (
	// biome-ignore lint/a11y/useSemanticElements: <explanation>
	<div role="status" className={cn(className)} {...props} ref={ref}>
		<svg
			className={cn(
				"animate-spin text-transparent",
				spinnerVariants({ size, color }),
			)}
			viewBox="0 0 100 101"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM25.0814 50.5908C25.0814 65.1895 35.4013 75.5094 50 75.5094C64.5987 75.5094 74.9186 65.1895 74.9186 50.5908C74.9186 35.9921 64.5987 25.6723 50 25.6723C35.4013 25.6723 25.0814 35.9921 25.0814 50.5908Z"
				fill="currentColor"
			/>
			<path
				d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
				fill="currentFill"
			/>
		</svg>
		<span className="sr-only">Loading...</span>
	</div>
));

export { Spinner, spinnerVariants };
