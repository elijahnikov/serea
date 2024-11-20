import { AvatarFallback, AvatarImage, AvatarRoot } from "@serea/ui/avatar";
import { cn } from "@serea/ui/cn";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";
import {
	BellIcon,
	LockIcon,
	LogOutIcon,
	SettingsIcon,
	UserIcon,
} from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { redirect } from "next/navigation";
import { auth } from "@serea/auth";
import { headers } from "next/headers";

export default function UserAvatar({
	avatar,
}: { avatar: { image?: string | null; name?: string | null } }) {
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger className="cursor-pointer" asChild>
					<AvatarRoot>
						<AvatarImage
							src={avatar.image ?? undefined}
							alt={`Navigation profile picture for ${avatar.name}`}
						/>
						<AvatarFallback>
							{avatar.name?.charAt(0).toLocaleUpperCase()}
						</AvatarFallback>
					</AvatarRoot>
				</DropdownMenuTrigger>

				<DropdownMenuContent align="center" className="min-w-[140px]">
					<DropdownMenuGroup>
						<DropdownMenuItem>
							<UserIcon size={14} />
							<span>Account</span>
						</DropdownMenuItem>

						<DropdownMenuItem>
							<SettingsIcon size={14} />
							<span>Settings</span>
						</DropdownMenuItem>

						<DropdownMenuItem>
							<LockIcon size={14} />
							<span>Privacy</span>
						</DropdownMenuItem>

						<DropdownMenuItem>
							<BellIcon size={14} />
							<span>Notifications</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<ThemeToggle />
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<form>
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button
								className={cn(
									"relative w-full flex cursor-pointer select-none items-center gap-2 px-4 py-1 outline-none hover:bg-surface dark:hover:bg-white/5",
									"text-destructive dark:text-red-400 [&_svg]:dark:text-red-400 [&_svg]:dark:opacity-60 [&_svg]:text-destructive [&_svg]:opacity-40",
									"pl-[var(--wg-offset-padding-left,1rem)]",
								)}
								formAction={async () => {
									"use server";
									await auth.api.signOut({
										headers: headers(),
									});
									throw redirect("/login");
								}}
							>
								<LogOutIcon size={14} />
								<span>Log Out</span>
							</button>
						</form>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
