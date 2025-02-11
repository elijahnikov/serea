import { auth } from "@serea/auth";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@serea/ui/dialog";

import { redirect } from "next/navigation";
import Sidebar from "~/components/common/navigation/sidebar";
import OnboardingComponent from "~/components/pages/onboarding";

export default async function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth();

	if (!session) {
		return redirect("/login");
	}

	return (
		<div className="flex h-screen">
			{!session.user.onboarded && (
				<Dialog open={true}>
					<DialogContent className="px-5 pt-4 pb-6" showClose={false}>
						<DialogHeader className="hidden" aria-hidden={true}>
							<DialogTitle>Onboarding</DialogTitle>
						</DialogHeader>
						<OnboardingComponent />
					</DialogContent>
				</Dialog>
			)}
			<Sidebar />
			<main className="flex-1 lg:ml-[240px]">{children}</main>
		</div>
	);
}
