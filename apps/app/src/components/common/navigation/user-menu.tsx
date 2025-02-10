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
						className="group text-sm w-full text-left justify-start items-center self-start"
						asChild
						before={
							<Avatar className="w-7 h-7 mr-2">
								<AvatarImage src={user.image} alt={user.name} />
								<AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
							</Avatar>
						}
					>
						<span className="w-full">{user.name}</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="relative left-4 min-w-[240px]">
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
