import { Toaster } from "@serea/ui/sonner";
import { ThemeProvider } from "@serea/ui/theme";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { utFileRouter } from "~/app/api/uploadthing/core";
import { TRPCReactProvider } from "~/trpc/react";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
			<TRPCReactProvider>
				<NextSSRPlugin routerConfig={extractRouterConfig(utFileRouter)} />
				{children}
				<Toaster position="bottom-center" />
			</TRPCReactProvider>
		</ThemeProvider>
	);
}
