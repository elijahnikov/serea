"use client";

import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui";
import { Button } from "@serea/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import {
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
	TooltipPortal,
	TooltipContent,
	TooltipArrow,
} from "@serea/ui/tooltip";
import { Check, UserPlus, X } from "lucide-react";
import { Suspense } from "react";
import SereaAvatar from "../serea-avatar";
import moment from "moment";
import Link from "next/link";
import { api } from "~/trpc/react";
import Loading from "@serea/ui/loading";

export default function Invites() {
	const trpcUtils = api.useUtils();
	const { data: invites, isLoading } =
		api.members.listInvitesForUser.useQuery();
	const { mutate: respond } = api.members.respond.useMutation({
		onSuccess: () => {
			trpcUtils.members.listInvitesForUser.invalidate();
			trpcUtils.members.listInvites.invalidate();
			trpcUtils.members.listMembers.invalidate();
		},
	});

	return (
		<Popover>
			<PopoverTrigger>
				<ToolbarTooltip content="Invites">
					<div
						className={cn(
							"group inline-flex shrink-0 select-none items-center justify-center text-sm font-medium leading-6 transition-colors duration-100 wg-antialiased focus:outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none",
							"gap-0 px-8px py-1 text-neutral-500 relative h-9 w-9 hover:border-[1px] border-surface-100",
							"bg-transparent hover:bg-surface rounded-lg",
						)}
					>
						<UserPlus size={18} className="stroke-[2px]" />
						{invites && invites.length > 0 && (
							<div className="bg-red-400 absolute top-2 right-2 rounded-full h-2 w-2" />
						)}
					</div>
				</ToolbarTooltip>
			</PopoverTrigger>
			<PopoverContent
				className="focus:outline-none min-w-[400px] max-h-[400px] overflow-y-auto focus:ring-0 relative -top-1.5 space-y-2"
				side="right"
			>
				{isLoading && (
					<div className="w-full h-full flex items-center justify-center">
						<Loading type="spinner" size="xs" />
					</div>
				)}
				{!isLoading && (!invites || invites.length === 0) && (
					<div className="w-full h-full flex items-center justify-center">
						<p className="text-neutral-500 text-xs">
							You currently have no invites.
						</p>
					</div>
				)}
				{!isLoading &&
					invites?.map((invite) => (
						<div className="flex items-center gap-2" key={invite.id}>
							<SereaAvatar
								url={invite.inviter.image}
								name={invite.inviter.name ?? ""}
								size="sm"
							/>
							<div>
								<div className="font-medium leading-snug">
									<span className="font-bold">{invite.inviter.name}</span>
									<span className="text-neutral-500">
										{" "}
										invited you to join{" "}
									</span>
									<Link href={`/watchlist/${invite.watchlist.id}`}>
										<span className="font-bold hover:underline">
											{invite.watchlist.title}
										</span>
									</Link>
								</div>
								<p className="text-xs leading-snug text-neutral-500">
									{moment(invite.createdAt).fromNow()}
								</p>
							</div>
							<div className="space-x-2 ml-6">
								<Button
									onClick={() =>
										respond({ invitationId: invite.id, response: "decline" })
									}
									size="xs-icon"
									variant="outline"
									className="p-1 h-6 w-6"
								>
									<X size={16} className="stroke-red-600" />
								</Button>
								<Button
									onClick={() =>
										respond({ invitationId: invite.id, response: "accept" })
									}
									size="xs-icon"
									variant="outline"
									className="p-1 h-6 w-6"
								>
									<Check size={16} className="stroke-green-600" />
								</Button>
							</div>
						</div>
					))}
			</PopoverContent>
		</Popover>
	);
}

export const ToolbarTooltip = ({
	content,
	children,
}: {
	content: string;
	children: React.ReactNode;
}) => {
	return (
		<TooltipProvider>
			<TooltipRoot>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipPortal>
					<TooltipContent side="right" content="" arrow>
						{content}
						<TooltipArrow />
					</TooltipContent>
				</TooltipPortal>
			</TooltipRoot>
		</TooltipProvider>
	);
};
