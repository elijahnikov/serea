import { Popover } from "@lemonsqueezy/wedges";
import { Button } from "@serea/ui/button";
import Input from "@serea/ui/input";
import { PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { CheckIcon, CopyIcon, Forward } from "lucide-react";
import { useState } from "react";
import { SocialLoginIcons } from "~/lib/constants";

export default function ShareButton({ watchlistId }: { watchlistId: string }) {
	const [copied, setCopied] = useState<boolean>(false);
	const link = `https://serea.co/watchlist/${watchlistId}`;

	const copyToClipboard = () => {
		navigator.clipboard.writeText(link).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button className="h-8" size={"xs-icon"} variant={"tertiary"}>
					<Forward size={18} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="min-w-[500px] ">
				<div className="flex items-center gap-2">
					<Input className="w-full" autoFocus={false} value={link} />
					<Button
						onClick={copyToClipboard}
						className="h-10"
						size={"xs-icon"}
						variant={"outline"}
					>
						{copied ? <CheckIcon size={18} /> : <CopyIcon size={18} />}
					</Button>
				</div>
				<div className="grid grid-cols-2 gap-2">
					<Button
						className="[&>svg]:opacity-100"
						variant={"tertiary"}
						before={SocialLoginIcons.X}
					>
						Twitter
					</Button>
					<Button
						variant={"tertiary"}
						className="[&>svg]:opacity-100"
						before={SocialLoginIcons.Reddit}
					>
						Reddit
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
