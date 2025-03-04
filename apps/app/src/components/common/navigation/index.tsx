"use server";

import { auth } from "@serea/auth";
import { Button } from "@serea/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@serea/ui/sheet";
import { BellIcon, MenuIcon } from "lucide-react";

import { Suspense } from "react";
import { HydrateClient, api } from "~/trpc/server";
import NavLinks from "./nav-links";
import Notifications from "./notifications";
import UserMenu from "./user-menu";

export default async function Sidebar() {
	void api.notification.getNotifications.prefetch();
	const user = await auth();

	return (
		<>
			<Sheet>
				<SheetTrigger asChild className="lg:hidden fixed left-4 top-4">
					<Button variant="outline" size="xs">
						<MenuIcon className="h-4 w-4" />
					</Button>
				</SheetTrigger>
				<SheetContent showClose={false} side="top">
					<nav className="p-4 min-w-[160px] w-full">
						<div className="flex items-center gap-2">
							<img src={"/logo.png"} alt="logo" className="w-12 h-12" />
						</div>
						<NavLinks />
					</nav>
				</SheetContent>
			</Sheet>

			<aside className="hidden lg:block w-max max-w-[240px] min-w-[240px] fixed border-r">
				<nav className="px-3 py-2 w-full min-h-screen ml-auto flex flex-col justify-between h-full">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<img src={"/logo.png"} alt="logo" className="w-12 h-12" />
						</div>
						<NavLinks />
					</div>
					<div className="flex flex-col gap-2">
						<hr className="-mx-2" />
						<div className="flex items-center gap-2">
							<UserMenu
								user={{
									name: String(user?.user.name),
									image: user?.user.image ?? "",
									email: String(user?.user.email),
								}}
							/>
							<HydrateClient>
								<Suspense fallback={<div>Loading...</div>}>
									<Notifications />
								</Suspense>
							</HydrateClient>
						</div>
					</div>
				</nav>
			</aside>
		</>
	);
}
