import { auth, signOut } from "@serea/auth";
import { Button } from "@serea/ui/button";
import { redirect } from "next/navigation";
import OnboardingForm from "./onboarding-form";

export default async function OnboardingComponent() {
	const user = await auth();

	if (!user) {
		return redirect("/login");
	}

	return (
		<div className="h-full w-full flex gap-4">
			<div className="h-full grid w-full place-items-center">
				<div className="flex items-center w-full justify-between">
					<div className="flex flex-col">
						<h1 className="font-medium text-lg">Onboarding</h1>
						<p className="text-sm text-muted-foreground">
							Please fill in the following details to get started
						</p>
					</div>
					<form>
						<Button
							variant="secondary"
							formAction={async () => {
								"use server";
								await signOut();
							}}
						>
							Sign out?
						</Button>
					</form>
				</div>
				<OnboardingForm user={user} />
			</div>
		</div>
	);
}
