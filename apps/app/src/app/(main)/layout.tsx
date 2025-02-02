import { auth } from "@serea/auth";
import { redirect } from "next/navigation";

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session) {
		return redirect("/login");
	}

	if (session && !session.user?.onboarded) {
		return redirect("/onboarding");
	}

	return <div>{children}</div>;
}
