import { auth, signIn, signOut } from "@serea/auth";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@serea/ui/dialog";
import { Button } from "@serea/ui/button";
import {
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuSeparator,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuShortcut,
	DropdownMenu,
} from "@serea/ui/dropdown-menu";
import {
	BookOpen,
	Download,
	Expand,
	EyeOff,
	Mail,
	Pin,
	Plus,
	Redo,
} from "lucide-react";

import Input from "@serea/ui/input";
import Avatar from "@serea/ui/avatar";
import AvatarGroup from "@serea/ui/avatar-group";
import Badge from "@serea/ui/badge";

export async function AuthShowcase() {
	const session = await auth();

	if (!session) {
		return (
			<form className="flex items-center">
				<Badge stroke color="yellow" before={<Plus />}>
					Label
				</Badge>
				<div className="m-auto max-w-sm text-left">
					<Input
						required
						label="Watchlist title"
						placeholder="Placeholder"
						helperText="Helper text"
					/>
				</div>
				<Dialog>
					<DialogTrigger asChild>
						<Button before={<Expand className="h-4 w-4" />} variant={"primary"}>
							Open
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Are you absolutely sure?</DialogTitle>
							<DialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<Button variant={"secondary"}>Cancel</Button>
							<Button variant={"outline"}>Save</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant={"outline"}
							before={<BookOpen className="h-4 w-4" />}
						>
							Open Menu
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent>
						<DropdownMenuGroup>
							<DropdownMenuItem disabled>
								<Redo size={14} />
								<span>Reply</span>
								<DropdownMenuShortcut keys={["option"]}>R</DropdownMenuShortcut>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<Pin size={14} />
								<span>Pin</span>
								<DropdownMenuShortcut keys={["option"]}>P</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuGroup>

						<DropdownMenuSeparator />

						<DropdownMenuGroup>
							<DropdownMenuItem>
								<Download size={14} />
								<span>Save this message</span>
								<DropdownMenuShortcut keys={["command"]}>
									S
								</DropdownMenuShortcut>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<EyeOff size={14} />
								<span>Mark as unread</span>
								<DropdownMenuShortcut keys={["command", "option"]}>
									U
								</DropdownMenuShortcut>
							</DropdownMenuItem>

							<DropdownMenuItem>
								<Mail size={14} />
								<span>Share via email</span>
								<DropdownMenuShortcut keys={["command"]}>
									U
								</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
				<Button
					variant={"outline"}
					formAction={async () => {
						"use server";
						await signIn("discord");
					}}
				>
					Sign in with Discord
				</Button>
			</form>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center gap-4">
			<p className="text-center text-2xl">
				<span>Logged in as {session.user.name}</span>
			</p>
			{session.user.image && (
				<Avatar
					className="rounded-full"
					src={session.user.image}
					alt={`User avatar for ${session.user.name}`}
				/>
			)}
			<AvatarGroup
				items={[
					{
						src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=250&h=250&auto=format&fit=crop",
						alt: "Avatar 1",
					},
					{
						src: "https://images.unsplash.com/photo-1579613832107-64359da23b0c?w=250&h=250&auto=format&fit=crop",
						alt: "Avatar 2",
					},
					{
						src: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=250&h=250&auto=format&fit=crop",
						alt: "Avatar 2",
					},
				]}
				size="lg"
			/>

			<form>
				<Button
					formAction={async () => {
						"use server";
						await signOut();
					}}
				>
					Sign out
				</Button>
			</form>
		</div>
	);
}
