import { auth } from "@serea/auth";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session) {
		return redirect("/login");
	}

	if (session?.user?.onboarded) {
		return redirect("/");
	}

	return <div className="grid min-h-screen min-w-screen p-4">{children}</div>;
}
