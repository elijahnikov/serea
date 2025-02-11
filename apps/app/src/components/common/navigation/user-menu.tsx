import { Button } from "@serea/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@serea/ui/avatar";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";
import {
	BellIcon,
	LockIcon,
	LogOutIcon,
	MenuIcon,
	SettingsIcon,
	UserCircleIcon,
	UserIcon,
} from "lucide-react";
import ThemeToggle from "./theme-toggle";

export default function UserMenu({
	user,
}: {
	user: {
		name: string;
		image: string;
		email: string;
	};
}) {
	return (
		<>
			<hr className="-mx-2" />
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="outline"
						className="group flex h-12 text-sm items-center justify-start"
					>
						<div className="flex items-center gap-2">
							<div className="mt-1">
								<Avatar
									size={"sm"}
									src={user.image}
									alt={"Users avatar"}
									initials={user.name.slice(0, 2)}
								/>
							</div>
							<div className="flex flex-col -gap-2 text-left">
								<p className="font-medium">{user.name}</p>
								<p className="text-xs leading-tight font-mono text-secondary-foreground/50">
									{user.email}
								</p>
							</div>
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="relative">
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
						<DropdownMenuItem className="text-red-500 hover:text-red-600">
							<LogOutIcon />
							<span>Logout</span>
						</DropdownMenuItem>
					</DropdownMenuGroup>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}
