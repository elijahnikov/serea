import { auth, signOut } from "@serea/auth";
import { Button } from "@serea/ui/button";
import { Card } from "@serea/ui/card";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import MovieHeader from "../login/movie-header";
import OnboardingForm from "./onboarding-form";

export default async function OnboardingComponent() {
	const user = await auth();

	if (!user) {
		return redirect("/login");
	}

	return (
		<div className="h-full w-full flex gap-4">
			<div className="h-full grid w-full place-items-center">
				<div className="absolute flex items-center top-4 left-4">
					<div className="w-full flex items-center justify-center">
						<img
							src="logo.png"
							alt="Serea logo"
							className="hover:scale-[0.85] duration-200 scale-100 h-8 md:h-12 w-8 md:w-12"
						/>
					</div>
					<p className="tracking-tight ml-1 text-base md:text-lg dark:text-neutral-300 text-neutral-700 font-semibold">
						serea
					</p>
				</div>
				<Card className="min-h-[70%] h-max p-4 sm:min-w-[500px] md:w-1/2 md:max-w-[500px] w-full justify-center relative flex px-4 flex-col">
					<div className="flex items-center justify-between">
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
				</Card>
			</div>
		</div>
	);
}
