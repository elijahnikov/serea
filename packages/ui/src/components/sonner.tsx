"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";
import { buttonVariants } from "./button";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			toastOptions={{
				unstyled: true,
				classNames: {
					toast:
						"bg-card antialiased border-0 dark:ring-1 ring-inset border-carbon-400 shadow-overlay dark:bg-carbon-dark-300 bg-carbon-100 dark:ring-carbon-dark-400 dark:border-t dark:border-carbon-dark-500 border group w-full min-h-12 flex items-center rounded-full px-3 py-2",
					title: "ml-2 text-sm text-secondary-foreground",
					icon: "mx-1 text-secondary-foreground",
					description: "ml-2 text-xs text-carbon-900",
					actionButton: buttonVariants({
						variant: "outline",
						shape: "pill",
						size: "sm",
					}),

					cancelButton: buttonVariants({
						variant: "outline",
						shape: "pill",
						size: "sm",
					}),
					closeButton: buttonVariants({
						variant: "outline",
						shape: "pill",
						size: "sm",
					}),
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
