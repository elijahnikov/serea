import { Button } from "@serea/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@serea/ui/avatar";
import { cn } from "@serea/ui/cn";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@serea/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";

export default function UserMenu({
	user,
}: {
	user: {
		name: string;
		image: string;
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
			<DropdownMenuContent>1</DropdownMenuContent>
		</DropdownMenu>
	);
}
