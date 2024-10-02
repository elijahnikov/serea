import { DropdownMenu } from "@lemonsqueezy/wedges";
import { auth, signIn, signOut } from "@serea/auth";
import { Button } from "@serea/ui/button";
import {
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
	DropdownMenuGroup,
	DropdownMenuShortcut,
} from "@serea/ui/dropdown-menu";
import { Download, EyeOff, Mail, Pin, Redo } from "lucide-react";
export async function AuthShowcase() {
	const session = await auth();

	if (!session) {
		return (
			<form>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant={"outline"}>Open Menu</Button>
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
