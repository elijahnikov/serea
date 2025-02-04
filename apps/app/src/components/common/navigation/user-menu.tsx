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
	LogOutIcon,
	MenuIcon,
	SettingsIcon,
	UserCircleIcon,
} from "lucide-react";

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
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="group hover:bg-stone-200/80 text-secondary-foreground/75 hover:text-black text-sm w-full active:bg-stone-300 text-left justify-start items-center self-start"
					asChild
					after={
						<div className="w-full">
							<MenuIcon className="ml-auto items-end justify-end group-hover:rotate-180 transition-all duration-200" />
						</div>
					}
					before={
						<Avatar className="w-7 h-7">
							<AvatarImage src={user.image} alt={user.name} />
							<AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
						</Avatar>
					}
				>
					<span className="w-full">{user.name}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="relative left-4 min-w-[240px]">
				<DropdownMenuLabel className="flex gap-2 items-center">
					<div className="flex px-3 flex-col gap-0">
						<span className="text-sm font-medium">{user.name}</span>
						<span className="text-xs font-normal text-muted-foreground">
							{user.email}
						</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						<UserCircleIcon />
						<span>Profile</span>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<SettingsIcon />
						<span>Settings</span>
					</DropdownMenuItem>
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
	);
}
