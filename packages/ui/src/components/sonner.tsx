"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			// theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group h-12 [&_svg]:h-6 gap-2 [&_svg]:w-6 rounded-full dark:text-white dark:border-surface-100 toast group-[.toaster]:bg-surface group-[.toaster]:dark:bg-neutral-800 border group-[.toaster]:shadow-wg-overlay wg-antialiased group-[.toast]:text-surface-900 font-medium group-[.toast]:dark:dark:text-surface-700 text-sm leading-6",
					description:
						"group-[.toast]:text-surface-900 dark:text-surface-200 font-medium group-[.toast]:dark:dark:text-surface-700 text-sm leading-6",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
