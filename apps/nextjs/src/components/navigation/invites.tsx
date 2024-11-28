"use client";

import type { RouterOutputs } from "@serea/api";
import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import { Spinner } from "@serea/ui/loading";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import {
	TooltipArrow,
	TooltipContent,
	TooltipPortal,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import { Check, UserPlus, X } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import SereaAvatar from "../common/serea-avatar";

export default function Invites({
	initialInvites,
}: { initialInvites: RouterOutputs["members"]["listInvitesForUser"] }) {
	const router = useRouter();
	const trpcUtils = api.useUtils();
	const { data: invites } = api.members.listInvitesForUser.useQuery(undefined, {
		initialData: initialInvites,
		staleTime: Number.POSITIVE_INFINITY,
	});
	const respond = api.members.respond.useMutation({
		onSuccess: (data, inputs) => {
			trpcUtils.members.listInvitesForUser.invalidate();
			if (inputs.response === "accept") {
				toast.success("Invite accepted, redirecting to watchlist...");
				if ("watchlist" in data) {
					router.push(`/watchlist/${data.watchlist}`);
				}
			}
		},
	});
	return (
		<Popover>
			<PopoverTrigger>
				<ToolbarTooltip content="Invites">
					<div
						className={cn(
							"group hover:bg-white dark:text-neutral-400 dark:hover:bg-black inline-flex shrink-0 select-none items-center justify-center text-sm font-medium leading-6 transition-colors duration-100 wg-antialiased focus:outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none",
							"gap-0 px-8px py-1 text-neutral-500 relative h-9 w-9 hover:border-[1px] border-surface-100",
							"rounded-lg",
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
				{(!invites || invites.length === 0) && (
					<div className="w-full h-full flex items-center justify-center">
						<p className="text-neutral-500 text-xs">
							You currently have no invites.
						</p>
					</div>
				)}
				{invites?.map((invite) => (
					<div className="flex items-center justify-between" key={invite.id}>
						<div className="flex items-center gap-2">
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
						</div>
						{respond.variables?.invitationId === invite.id &&
						respond.isPending ? (
							<Spinner />
						) : (
							<div className="space-x-2 flex items-center ml-6">
								<Button
									onClick={() =>
										respond.mutate({
											invitationId: invite.id,
											response: "decline",
										})
									}
									size="xs-icon"
									variant="outline"
									className="p-1 h-6 w-6"
								>
									<X size={16} className="stroke-red-600" />
								</Button>
								<Button
									onClick={() =>
										respond.mutate({
											invitationId: invite.id,
											response: "accept",
										})
									}
									size="xs-icon"
									variant="outline"
									className="p-1 h-6 w-6"
								>
									<Check size={16} className="stroke-green-600" />
								</Button>
							</div>
						)}
					</div>
				))}
			</PopoverContent>
		</Popover>
	);
}

export const ToolbarTooltip = ({
	content,
	children,
	side = "right",
}: {
	content: string;
	children: React.ReactNode;
	side?: "right" | "top" | "bottom" | "left" | undefined;
}) => {
	return (
		<TooltipProvider>
			<TooltipRoot>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipPortal>
					<TooltipContent side={side} content="" arrow>
						{content}
						<TooltipArrow />
					</TooltipContent>
				</TooltipPortal>
			</TooltipRoot>
		</TooltipProvider>
	);
};
