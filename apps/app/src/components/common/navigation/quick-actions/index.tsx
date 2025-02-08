"use client";

import { Badge } from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@serea/ui/command";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@serea/ui/dialog";
import _ from "lodash";
import {
	FileTextIcon,
	ListIcon,
	SettingsIcon,
	UserIcon,
	VideoIcon,
	ZapIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useMeasure } from "react-use";
import CreateWatchlist from "./create-watchlist";

export default function QuickActions() {
	const [open, setOpen] = React.useState(false);
	const [view, setView] = React.useState<"commands" | "watchlist">("commands");

	const router = useRouter();

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const commands = React.useMemo(() => {
		return {
			actions: [
				{
					label: "Review a movie",
					icon: FileTextIcon,
					onSelect: () => setView("watchlist"),
				},
				{
					label: "Create a new watchlist",
					icon: ListIcon,
					onSelect: () => setView("watchlist"),
				},
			],
			pages: [
				{
					label: "Profile",
					icon: UserIcon,
					onSelect: () => router.push("/profile"),
				},
				{
					label: "Settings",
					icon: SettingsIcon,
					onSelect: () => router.push("/settings"),
				},
				{
					label: "Watchlists",
					icon: ListIcon,
					onSelect: () => router.push("/watchlists"),
				},
				{
					label: "Reviews",
					icon: FileTextIcon,
					onSelect: () => router.push("/reviews"),
				},
				{
					label: "Movies",
					icon: VideoIcon,
					onSelect: () => router.push("/users"),
				},
			],
		};
	}, []);

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={(open) => {
					if (!open) {
						setView("commands");
					}
					setOpen(open);
				}}
			>
				<DialogTrigger asChild>
					<Button
						onClick={() => setOpen(true)}
						className="group shadow-md"
						before={
							<ZapIcon className="group-hover:rotate-180 transition-all duration-200" />
						}
						after={
							<Badge
								color="blue"
								className="min-w-max text-xs px-2 py-2 h-5 [&>svg]:size-2.5"
							>
								⌘K
							</Badge>
						}
					>
						Quick actions
					</Button>
				</DialogTrigger>
				<DialogHeader className="hidden" aria-hidden="true">
					<DialogTitle>Quick actions</DialogTitle>
				</DialogHeader>
				<DialogContent
					onEscapeKeyDown={(e) => {
						if (view !== "commands") {
							e.preventDefault();
							setView("commands");
						}
					}}
					showClose={false}
					className="overflow-hidden p-0 focus-visible:ring-0 focus:ring-0 focus-visible:outline-none min-w-max"
				>
					<AnimatedDialogContent view={view}>
						{view === "commands" && (
							<Command className="border-0">
								<div className="relative">
									<CommandInput placeholder="Search for commands, movies, watchlists and users..." />
									<kbd className="absolute top-2.5 right-4 -me-1 ms-12 inline-flex h-5 max-h-full items-center rounded border border-border bg-background px-1 font-[inherit] text-[0.625rem] font-medium text-muted-foreground/70">
										ESC
									</kbd>
								</div>
								<CommandList className="border-none">
									<CommandEmpty>No results found.</CommandEmpty>
									{Object.entries(commands).map(([key, value], index) => {
										return (
											<React.Fragment key={key}>
												<CommandGroup
													heading={_.startCase(key)}
													className="border-none"
												>
													{value.map((command, index) => {
														const Icon = command.icon;
														return (
															<CommandItem
																onSelect={command.onSelect}
																key={index}
															>
																<Icon
																	strokeWidth={2}
																	className="opacity-60"
																	aria-hidden="true"
																/>
																<span>{command.label}</span>
															</CommandItem>
														);
													})}
												</CommandGroup>
												{index !== Object.entries(commands).length - 1 && (
													<CommandSeparator />
												)}
											</React.Fragment>
										);
									})}
								</CommandList>
							</Command>
						)}
						{view === "watchlist" && (
							<CreateWatchlist goBack={() => setView("commands")} />
						)}
					</AnimatedDialogContent>
				</DialogContent>
			</Dialog>
		</>
	);
}

const AnimatedDialogContent = ({
	children,
	view,
}: { children: React.ReactNode; view: string }) => {
	const [ref, { height }] = useMeasure<HTMLDivElement>();

	return (
		<motion.div
			animate={{ height: height || "auto" }}
			transition={{ type: "spring", stiffness: 300, damping: 30 }}
			style={{ overflow: "hidden" }}
		>
			<AnimatePresence mode="wait" initial={false}>
				<motion.div
					key={view}
					initial={{ opacity: 0, y: view !== "commands" ? 10 : -10, x: 0 }}
					animate={{ opacity: 1, y: 0, x: 0 }}
					exit={{ opacity: 0, y: view !== "commands" ? -10 : 10, x: 0 }}
					transition={{ duration: 0.1 }}
					ref={ref}
				>
					{children}
				</motion.div>
			</AnimatePresence>
		</motion.div>
	);
};
