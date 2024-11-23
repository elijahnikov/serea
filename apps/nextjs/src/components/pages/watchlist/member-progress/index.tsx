"use client";

import { AvatarRoot, AvatarWedges } from "@serea/ui/avatar";
import Badge from "@serea/ui/badge";
import { Skeleton } from "@serea/ui/skeleton";
import {
	TooltipContent,
	TooltipProvider,
	TooltipRoot,
	TooltipTrigger,
} from "@serea/ui/tooltip";
import { Crown } from "lucide-react";
import ProgressCircle from "./progress-circle";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "@serea/api";

export default async function MembersProgress({
	watchlistId,
	initialData,
}: {
	watchlistId: string;
	initialData: RouterOutputs["watched"]["getWatchlistProgress"];
}) {
	const { data: watchlistProgress } = api.watched.getWatchlistProgress.useQuery(
		{
			id: watchlistId,
		},
		{
			initialData,
			staleTime: Number.POSITIVE_INFINITY,
		},
	);

	if (!watchlistProgress) return null;

	const { members, entriesLength } = watchlistProgress;

	const sortedMembers = [...members].sort((a, b) => {
		const roleOrder = { owner: 0, editor: 1, viewer: 2 };
		return (
			roleOrder[a.role as keyof typeof roleOrder] -
			roleOrder[b.role as keyof typeof roleOrder]
		);
	});

	return (
		<div>
			<div className="flex items-center mb-2">
				<p className="font-medium dark:text-neutral-400 text-neutral-600 text-sm">
					Members
				</p>
				<Badge
					color="gray"
					className="ml-2 text-xs bg-surface-400 border font-medium text-neutral-600 border-surface-100"
				>
					{sortedMembers.length}
				</Badge>
			</div>
			<TooltipProvider>
				<div className="space-y-2">
					{sortedMembers.map((member) => (
						<div key={member.id}>
							<div className="flex items-center gap-2">
								<TooltipRoot>
									<TooltipTrigger asChild>
										<div className="relative">
											<ProgressCircle
												progress={member.watched.length}
												total={entriesLength}
											/>
											<div className="absolute inset-0 flex items-center justify-center">
												<AvatarRoot>
													<AvatarWedges
														size="md"
														src={member.user.image ?? undefined}
														alt={`Profile picture for ${member.user.name}`}
														initials={member.user.name?.charAt(0)}
													/>
												</AvatarRoot>
											</div>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										{member.watched.length} / {entriesLength} watched
									</TooltipContent>
								</TooltipRoot>
								<div className="flex items-center space-x-1">
									<h3 className="text-md font-medium">{member.user.name}</h3>
									{member.role === "owner" && (
										<Crown
											className="fill-neutral-600 dark:text-neutral-400 dark:fill-neutral-400 text-neutral-600"
											size={14}
										/>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</TooltipProvider>
		</div>
	);
}

export function MembersProgressLoading() {
	// Create an array of 3 items for skeleton loading
	const skeletonMembers = Array.from({ length: 3 });

	return (
		<div className="mt-6">
			<div className="flex items-center mb-2">
				<Skeleton className="h-6 w-32" />
			</div>

			<div className="space-y-2">
				{skeletonMembers.map((_, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<div key={index}>
						<div className="flex items-center gap-2">
							<div className="relative">
								{/* Skeleton circle background */}
								<ProgressCircle progress={0} total={0} />
								<div className="absolute inset-0 flex items-center justify-center">
									<AvatarRoot>
										<AvatarWedges
											size="md"
											initials=""
											className="bg-surface-100 animate-pulse"
										/>
									</AvatarRoot>
								</div>
							</div>
							<div
								className="h-5 bg-surface-100 rounded animate-pulse"
								style={{
									width: `${Math.floor(Math.random() * (120 - 80) + 80)}px`,
								}}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
