import { signOut } from "@serea/auth";
import { cn } from "@serea/ui";
import { AvatarRoot, AvatarImage, AvatarFallback } from "@serea/ui/avatar";

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
	BookIcon,
	HelpCircleIcon,
	LockIcon,
	LogOutIcon,
	MoonIcon,
	SettingsIcon,
	UserIcon,
} from "lucide-react";

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
						<DropdownMenuItem>
							<BookIcon size={14} />
							<span>Help Guide</span>
						</DropdownMenuItem>

						<DropdownMenuItem>
							<HelpCircleIcon size={14} />
							<span>Help Center</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<DropdownMenuItem>
							<MoonIcon size={14} />
							<span>Dark Mode</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>

					<DropdownMenuSeparator />

					<DropdownMenuGroup>
						<div>
							<form className="flex">
								{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
								<button
									className={cn(
										"relative w-full flex cursor-pointer select-none items-center gap-2 px-4 py-1 outline-none hover:bg-surface dark:hover:bg-white/5",
										"text-destructive [&_svg]:text-destructive [&_svg]:opacity-40",
										"pl-[var(--wg-offset-padding-left,1rem)]",
									)}
									formAction={async () => {
										"use server";
										await signOut();
									}}
								>
									<LogOutIcon size={14} />
									<span>Log Out</span>
								</button>
							</form>
						</div>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
