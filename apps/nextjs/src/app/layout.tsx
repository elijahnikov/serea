import { ThemeProvider } from "@serea/ui/theme";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { cn } from "@serea/ui/cn";
import { Toaster } from "@serea/ui/sonner";
import { env } from "~/env";

const sereaFont = localFont({
	src: [
		{
			path: "./fonts/OpenRunde-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/OpenRunde-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/OpenRunde-Semibold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "./fonts/OpenRunde-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-serea",
});

export const metadata: Metadata = {
	metadataBase: new URL(
		env.VERCEL_ENV === "production"
			? "https://serea.co"
			: "http://localhost:3000",
	),
	title: "Serea",
	description: "Simple monorepo with shared backend for web & mobile apps",
	openGraph: {
		title: "Create T3 Turbo",
		description: "Simple monorepo with shared backend for web & mobile apps",
		url: "https://create-t3-turbo.vercel.app",
		siteName: "Create T3 Turbo",
	},
	twitter: {
		card: "summary_large_image",
		site: "@jullerino",
		creator: "@jullerino",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
		{ media: "(prefers-color-scheme: dark)", color: "black" },
	],
};

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
					<Toaster position="bottom-center" />
				</ThemeProvider>
			</body>
		</html>
	);
}
