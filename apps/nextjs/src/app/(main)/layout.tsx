import { auth } from "@serea/auth";
import { redirect } from "next/navigation";
import type React from "react";
import Navigation from "~/components/navigation/navigation";

export default async function MainLayout({
	children,
}: { children: React.ReactNode }) {
	const session = await auth();
	if (!session) {
		redirect("/login");
	}
	return (
		<div className="mx-auto min-h-[calc(100vh-180px)]">
			<div className="flex flex-col md:flex-row">
				<Navigation />
				<main className="max-h-[100vh] container h-screen w-full space-y-4 overflow-y-auto">
					<div>{children}</div>
				</main>
			</div>
		</div>
	);
}
