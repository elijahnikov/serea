"use client";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
	TRPCClientError,
	type TRPCLink,
	loggerLink,
	unstable_httpBatchStreamLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";
import SuperJSON from "superjson";

import type { AppRouter } from "@serea/api";

import { observable } from "@trpc/server/observable";
import { toast } from "sonner";
import { env } from "~/env";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
	if (typeof window === "undefined") {
		// Server: always make a new query client
		return createQueryClient();
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else {
		// Browser: use singleton pattern to keep the same query client
		// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
		return (clientQueryClientSingleton ??= createQueryClient());
	}
};

export const customLink: TRPCLink<AppRouter> = () => {
	// here we just got initialized in the app - this happens once per app
	// useful for storing cache for instance
	return ({ next, op }) => {
		// this is when passing the result to the next link
		// each link needs to return an observable which propagates results
		return observable((observer) => {
			const unsubscribe = next(op).subscribe({
				next(value) {
					observer.next(value);
				},
				error(err) {
					observer.error(err);
					if (
						err instanceof TRPCClientError &&
						err.data?.code === "TOO_MANY_REQUESTS"
					) {
						toast.error(
							"You are making too many requests. Please try again later.",
						);
					}
				},
				complete() {
					observer.complete();
				},
			});
			return unsubscribe;
		});
	};
};

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	const [trpcClient] = useState(() =>
		api.createClient({
			links: [
				customLink,
				loggerLink({
					enabled: (op) =>
						env.NODE_ENV === "development" ||
						(op.direction === "down" && op.result instanceof Error),
				}),
				unstable_httpBatchStreamLink({
					transformer: SuperJSON,
					url: `${getBaseUrl()}/api/trpc`,
					headers() {
						const headers = new Headers();
						headers.set("x-trpc-source", "nextjs-react");
						return headers;
					},
				}),
			],
		}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{props.children}
			</api.Provider>
		</QueryClientProvider>
	);
}

const getBaseUrl = () => {
	if (typeof window !== "undefined") return window.location.origin;
	if (env.VERCEL_URL) return `https://${env.VERCEL_URL}`;
	return `http://localhost:${process.env.PORT ?? 3000}`;
};
