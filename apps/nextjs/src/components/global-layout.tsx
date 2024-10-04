import type React from "react";
import Navigation from "./navigation";

export default function GlobalLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<div className="mx-auto min-h-[calc(100vh-180px)]">
			<div className="flex flex-col md:flex-row">
				<Navigation />
				<main className="max-h-[100vh] w-full space-y-4 overflow-y-auto">
					<div>{children}</div>
				</main>
			</div>
		</div>
	);
}
