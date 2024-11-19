import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
const cn = (...inputs) => twMerge(cx(inputs));
export { cn };
