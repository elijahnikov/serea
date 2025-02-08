import { signIn } from "@serea/auth";
import { Button } from "@serea/ui/button";
import { SOCIAL_LOGIN_ICONS } from "~/lib/constants";

type Socials = "discord" | "google";

const socials: { id: Socials; icon: React.ReactNode; label: string }[] = [
	{
		id: "discord",
		icon: SOCIAL_LOGIN_ICONS.DISCORD,
		label: "Discord",
	},
	{
		id: "google",
		icon: SOCIAL_LOGIN_ICONS.GOOGLE,
		label: "Google",
	},
];

export default function LoginButtons() {
	return (
		<form className="space-y-2">
			{socials.map((social) => (
				<Button
					className="w-full"
					formAction={async () => {
						"use server";
						await signIn(social.id);
					}}
					variant={"outline"}
					key={social.id}
				>
					<div className="w-full items-center flex space-x-1">
						{social.icon}
						<p>Continue with {social.label}</p>
					</div>
				</Button>
			))}
		</form>
	);
}
