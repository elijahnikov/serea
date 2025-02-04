import { Badge } from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import {
	CommandIcon,
	FileTextIcon,
	FilmIcon,
	HomeIcon,
	ListIcon,
	MenuIcon,
	StarIcon,
	VideoIcon,
	ZapIcon,
} from "lucide-react";
import Link from "next/link";

const links = [
	{
		label: "Home",
		href: "/",
		icon: HomeIcon,
	},
	{
		label: "Watchlists",
		href: "/watchlists",
		icon: ListIcon,
	},
	{
		label: "Reviews",
		href: "/reviews",
		icon: FileTextIcon,
	},
	{
		label: "Movies",
		href: "/movies",
		icon: VideoIcon,
	},
];

export default function NavLinks() {
	return (
		<div className="flex mt-4 flex-col gap-[4px]">
			{links.map((link, index) => {
				const Icon = link.icon;
				return (
					<Button
						variant="ghost"
						className="group hover:bg-stone-200/80 text-secondary-foreground/75 hover:text-black text-sm w-full active:bg-stone-300 text-left justify-start items-center self-start"
						asChild
						key={link.href}
						before={
							<Icon
								className={cn(
									index % 2 === 0
										? "group-hover:rotate-6"
										: "group-hover:-rotate-6",
									"group-hover:scale-[1.15]  transition-all duration-200 w-6 h-6",
								)}
							/>
						}
					>
						<Link className="w-full" key={link.href} href={link.href}>
							<span className="group-hover:translate-x-1 transition-all duration-200">
								{link.label}
							</span>
						</Link>
					</Button>
				);
			})}
			<Button
				className="group"
				before={
					<ZapIcon className="group-hover:rotate-180 transition-all duration-200" />
				}
				after={
					<Badge
						color="blue"
						className="min-w-max text-xs [&_svg]:size-2.5 px-2 py-2 h-5"
						before={<CommandIcon />}
					>
						K
					</Badge>
				}
			>
				Quick actions
			</Button>
		</div>
	);
}
