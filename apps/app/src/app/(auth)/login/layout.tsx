import { auth } from "@serea/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (session && !session.user?.onboarded) {
		return redirect("/onboarding");
	}
	if (session) {
		return redirect("/");
	}

	return <div className="grid min-h-screen min-w-screen p-4">{children}</div>;
}
