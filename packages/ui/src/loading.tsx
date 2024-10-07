import * as React from "react";
import { cva, type VariantProps } from "cva";
import { cn } from ".";

export const calcDimension = (
	size: VariantProps<typeof loadingVariants>["size"],
) => {
	switch (size) {
		case "xxs":
			return 16;
		case "xs":
			return 24;
		case "sm":
			return 32;
		case "md":
			return 48;
		case "lg":
			return 56;
		case "xl":
			return 64;
		case "xxl":
			return 88;
		default:
			return 48;
	}
};

export const calcStroke = (
	size: VariantProps<typeof loadingVariants>["size"],
) => {
	switch (size) {
		case "xxs":
			return 4;
		case "xs":
			return 4;
		case "sm":
			return 4;
		case "md":
			return 6;
		case "lg":
			return 6;
		case "xl":
			return 6;
		case "xxl":
			return 8;
		default:
			return 6;
	}
};

export const getDbySize = (
	size: VariantProps<typeof loadingVariants>["size"],
) => {
	switch (size) {
		case "xxs":
			return "M14 8a6 6 0 00-6-6";
		case "xs":
			return "M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2";
		case "sm":
			return "M30 16C30 14.1615 29.6379 12.341 28.9343 10.6424C28.2307 8.94387 27.1995 7.40052 25.8995 6.1005C24.5995 4.80048 23.0561 3.76925 21.3576 3.06569C19.659 2.36212 17.8385 2 16 2";
		case "md":
			return "M45 24C45 21.2422 44.4568 18.5115 43.4015 15.9636C42.3461 13.4158 40.7993 11.1008 38.8492 9.15076C36.8992 7.20073 34.5842 5.65388 32.0364 4.59853C29.4885 3.54318 26.7578 3 24 3";
		case "lg":
			return "M53 28C53 24.717 52.3534 21.4661 51.097 18.4329C49.8406 15.3998 47.9991 12.6438 45.6777 10.3223C43.3562 8.00087 40.6002 6.15938 37.5671 4.90301C34.5339 3.64664 31.283 3 28 3";
		case "xl":
			return "M61 32C61 28.1917 60.2499 24.4206 58.7925 20.9022C57.3351 17.3837 55.199 14.1868 52.5061 11.4939C49.8132 8.801 46.6163 6.66488 43.0978 5.20749C39.5794 3.75011 35.8083 3 32 3";
		case "xxl":
			return "M84 44C84 38.7471 82.9654 33.5457 80.9552 28.6927C78.945 23.8396 75.9986 19.4301 72.2843 15.7157C68.5699 12.0014 64.1604 9.05501 59.3073 7.04482C54.4543 5.03463 49.2529 4 44 4";
		default:
			return "M45 24C45 21.2422 44.4568 18.5115 43.4015 15.9636C42.3461 13.4158 40.7993 11.1008 38.8492 9.15076C36.8992 7.20073 34.5842 5.65388 32.0364 4.59853C29.4885 3.54318 26.7578 3 24 3";
	}
};

export const Spinner = React.forwardRef<
	SVGSVGElement,
	React.SVGAttributes<SVGSVGElement> &
		{ size: VariantProps<typeof loadingVariants> }["size"]
>((props, ref) => {
	const { size, ...otherProps } = props;
	const dimension = calcDimension(size);
	const stroke = calcStroke(size);

	return (
		<svg
			ref={ref}
			aria-hidden="true"
			viewBox={`0 0 ${dimension} ${dimension}`}
			{...otherProps}
		>
			<circle
				cx={dimension / 2}
				cy={dimension / 2}
				fill="none"
				r={dimension / 2 - stroke / 2}
				strokeWidth={stroke}
			/>
			<path
				d={getDbySize(size)}
				className="stroke-current"
				fill="none"
				strokeLinecap="round"
				strokeWidth={stroke}
			/>
		</svg>
	);
});

/* ---------------------------------- Types --------------------------------- */
export type LoadingElement = HTMLDivElement;
export type LoadingProps = React.HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof loadingVariants>;

/* -------------------------------- Variants -------------------------------- */
export const loadingVariants = cva({
	base: "relative inline-flex items-center justify-center border-0",
	variants: {
		color: {
			primary: "stroke-surface-100 text-primary",
			secondary: "stroke-surface-100 text-secondary",
		},
		size: {
			xxs: "size-4",
			xs: "size-6",
			sm: "size-8",
			md: "size-12 [--wg-loading-stroke-width:6px]",
			lg: "size-14",
			xl: "size-16",
			xxl: "size-[88px]",
		},
		type: {
			line: "",
			spinner: "-rotate-45",
			dots: "",
		},
	},
	defaultVariants: {
		color: "primary",
		size: "md",
		type: "line",
	},
});

/* ------------------------------- Components ------------------------------- */
const Loading = React.forwardRef<LoadingElement, LoadingProps>((props, ref) => {
	const {
		"aria-label": ariaLabel = "Loading",
		className,
		color = "primary",
		size = "md",
		type = "line",
		...otherProps
	} = props;

	let element = null;

	switch (type) {
		case "spinner":
			element = (
				<Spinner
					className="size-full animate-[spin_.6s_ease-in-out_infinite] will-change-transform"
					size={size}
				/>
			);
			break;
	}

	return (
		<div
			ref={ref}
			aria-label={ariaLabel}
			className={cn(loadingVariants({ color, size, type }), className)}
			{...otherProps}
		>
			{element}
		</div>
	);
});

Loading.displayName = "Loading";
export default Loading;
