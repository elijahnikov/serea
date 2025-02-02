import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@serea/ui/theme";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import localFont from "next/font/local";

import { cn } from "@serea/ui/cn";
import { env } from "~/env";

export const metadata: Metadata = {
	metadataBase: new URL(
		env.VERCEL_ENV === "production"
			? "https://app.serea.co"
			: "http://localhost:3000",
	),
	title: "Serea",
	description: "Simple monorepo with shared backend for web & mobile apps",
	openGraph: {
		title: "Serea",
		description: "Simple monorepo with shared backend for web & mobile apps",
		url: "https://app.serea.co",
		siteName: "Serea",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

const sereaFont = localFont({
	src: [
		{
			path: "../lib/fonts/OpenRunde-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../lib/fonts/OpenRunde-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../lib/fonts/OpenRunde-Semibold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../lib/fonts/OpenRunde-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-serea",
});

export default function RootLayout(props: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					"min-h-screen bg-background font-serea text-foreground antialiased",
					sereaFont.variable,
				)}
			>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<TRPCReactProvider>{props.children}</TRPCReactProvider>

					{/* <Toaster /> */}
				</ThemeProvider>
			</body>
		</html>
	);
}
