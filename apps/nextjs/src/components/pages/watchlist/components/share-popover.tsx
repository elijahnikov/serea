import { Button } from "@serea/ui/button";
import Input from "@serea/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { Check, Copy, Forward } from "lucide-react";
import { useState } from "react";

const socialPlatforms = ["Twitter", "Facebook", "LinkedIn", "Email"];

export default function SharePopover({ id }: { id: string }) {
	const [copied, setCopied] = useState(false);

	const shareUrl = `https://serea.co/watchlist/${id}`;
	const copyToClipboard = () => {
		navigator.clipboard.writeText(shareUrl).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button size={"xs-icon"} variant={"tertiary"}>
					<Forward size={18} className=" text-neutral-400" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="min-w-[400px]">
				<div className="flex gap-2">
					<Input value={shareUrl} />
					<Button size={"xs-icon"} onClick={copyToClipboard}>
						{copied ? (
							<Check size={18} className=" text-neutral-300" />
						) : (
							<Copy size={18} className=" text-neutral-300" />
						)}
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}
