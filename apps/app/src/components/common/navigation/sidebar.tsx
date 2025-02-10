"use server";

import { auth } from "@serea/auth";
import { Button } from "@serea/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@serea/ui/sheet";
import { MenuIcon } from "lucide-react";

import NavLinks from "./nav-links";
import UserMenu from "./user-menu";

export default async function Sidebar() {
	const user = await auth();
	user?.user.name;
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

			<aside className="hidden lg:block max-w-max min-w-[200px] border-r">
				<nav className="p-2 w-full ml-auto flex flex-col justify-between h-full">
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<img src={"/logo.png"} alt="logo" className="w-12 h-12" />
						</div>
						<NavLinks />
					</div>
					<div className="flex flex-col gap-2">
						<UserMenu
							user={{
								name: String(user?.user.name),
								image: user?.user.image ?? "",
								email: String(user?.user.email),
							}}
						/>
					</div>
				</nav>
			</aside>
		</>
	);
}
