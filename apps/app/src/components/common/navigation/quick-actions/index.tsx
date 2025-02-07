"use client";

import { Badge } from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "@serea/ui/command";
import { Dialog, DialogContent, DialogTrigger } from "@serea/ui/dialog";
import {
	Calculator,
	Calendar,
	CommandIcon,
	CreditCard,
	FileTextIcon,
	ListIcon,
	SearchIcon,
	Settings,
	Smile,
	User,
	ZapIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useMeasure } from "react-use";
import CreateWatchlist from "./create-watchlist";

export default function QuickActions() {
	const [open, setOpen] = React.useState(false);
	const [view, setView] = React.useState<"commands" | "watchlist">("commands");

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
						className="group shadow-md focus-visible:ring-0 focus:ring-0 focus-visible:outline-none"
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
									<CommandGroup className="border-none">
										<CommandItem>
											<FileTextIcon
												strokeWidth={2}
												className="opacity-60"
												aria-hidden="true"
											/>
											<span>Review a movie</span>
										</CommandItem>
										<CommandItem
											onSelect={() => setView("watchlist")}
											className="focus-visible:ring-0 focus:ring-0 focus-visible:outline-none"
										>
											<ListIcon
												strokeWidth={2}
												className="opacity-60"
												aria-hidden="true"
											/>
											<span>Create a new watchlist</span>
										</CommandItem>
										<CommandItem>
											<SearchIcon
												strokeWidth={2}
												className="opacity-60"
												aria-hidden="true"
											/>
											<span>Search for a movie</span>
										</CommandItem>
									</CommandGroup>
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
