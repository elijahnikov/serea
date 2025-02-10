import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import { FileTextIcon, HomeIcon, ListIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import QuickActions from "./quick-actions";

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
						variant="transparent"
						className="group text-sm w-full text-left justify-start items-center self-start"
						asChild
						key={link.href}
						before={
							<Icon
								className={cn(
									index % 2 === 0
										? "group-hover:rotate-6"
										: "group-hover:-rotate-6",
									"group-hover:scale-[1.15] transition-all duration-200 w-4 h-4",
								)}
							/>
						}
					>
						<Link className="w-full" key={link.href} href={link.href}>
							<span className="group-hover:translate-x-1 text-sm ml-1 transition-all duration-200">
								{link.label}
							</span>
						</Link>
					</Button>
				);
			})}
			<QuickActions />
		</div>
	);
}
