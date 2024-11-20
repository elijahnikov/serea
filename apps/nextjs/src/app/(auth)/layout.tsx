import { auth, getSession } from "@serea/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function AuthLayout({
	children,
}: { children: ReactNode }) {
	const session = await getSession();
	if (session) {
		redirect("/");
	}
	return <div className="grid min-h-screen min-w-screen p-4">{children}</div>;
}
