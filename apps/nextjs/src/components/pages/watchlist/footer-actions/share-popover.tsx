import { cn } from "@serea/ui";
import { Button } from "@serea/ui/button";
import Input from "@serea/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { Check, Copy, Forward } from "lucide-react";
import { useState } from "react";
import { ToolbarTooltip } from "~/components/navigation/invites";

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
			<PopoverTrigger>
				<ToolbarTooltip side="top" content="Share">
					<div
						className={cn(
							"group inline-flex shrink-0 select-none items-center justify-center text-sm font-medium leading-6 transition-colors duration-100 wg-antialiased focus:outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none",
							"gap-0 px-8px py-1 text-neutral-500 relative h-8 w-8",
							"bg-surface hover:bg-surface-100 rounded-lg",
						)}
					>
						<Forward size={18} className="stroke-[2px]" />
					</div>
				</ToolbarTooltip>
			</PopoverTrigger>
			<PopoverContent side="top" className="min-w-[400px] z-50">
				<div className="flex gap-2">
					<Input autoFocus={false} value={shareUrl} />
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
