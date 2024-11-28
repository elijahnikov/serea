"use server";

import { getSession } from "@serea/auth";
import { Button } from "@serea/ui/button";
import {
	TooltipArrow,
	TooltipContent,
	TooltipPortal,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import { Compass, List, Plus, User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { api } from "~/trpc/server";
import Invites from "./invites";
import UserAvatar from "./user-avatar";

const navigationLinks = [
	{
		label: "Your profile",
		href: "/profile",
		icon: <User size={18} className="stroke-[2px]" />,
	},
	{
		label: "Your watchlists",
		href: "/watchlists",
		icon: <List size={18} className="stroke-[2px]" />,
	},
	{
		label: "Discover",
		href: "/discover",
		icon: <Compass size={18} className="stroke-[2px]" />,
	},
	{
		label: "Create",
		href: "/create",
		icon: <Plus size={18} className="stroke-[2px]" />,
	},
];

async function InvitesData() {
	const invites = await api.members.listInvitesForUser();
	return <Invites initialInvites={invites} />;
}

export default async function Navigation() {
	const session = await getSession();

	return (
		<div className="w-16 justify-between bg-stone-100 dark:bg-neutral-900 dark:border-neutral-800 flex items-center flex-col py-4 border-r border-stone-200">
			<Link href={"/"} className="active:scale-[0.85] duration-200 scale-100">
				<img className="h-12 w-12" src="/logo.png" alt="Serea logo" />
			</Link>
			<div className="flex items-center flex-col space-y-1">
				<TooltipProvider>
					{navigationLinks.map((link) => (
						<TooltipRoot key={link.href}>
							<TooltipTrigger>
								<Link key={link.href} href={link.href}>
									<Button
										size={"xs-icon"}
										variant={"transparent"}
										className="text-neutral-500 dark:text-neutral-400 dark:hover:bg-black hover:bg-white h-9 w-9 hover:border-[1px] border-surface-100"
									>
										{link.icon}
									</Button>
								</Link>
							</TooltipTrigger>
							<TooltipPortal>
								<TooltipContent side="right" content="" arrow>
									<p>{link.label}</p>
									<TooltipArrow />
								</TooltipContent>
							</TooltipPortal>
						</TooltipRoot>
					))}
				</TooltipProvider>
			</div>
			<div className="flex items-center justify-center space-y-1 flex-col">
				<Suspense fallback={<p>loading</p>}>
					<InvitesData />
				</Suspense>
				{session ? <UserAvatar avatar={{ ...session.user }} /> : null}
			</div>
		</div>
	);
}
