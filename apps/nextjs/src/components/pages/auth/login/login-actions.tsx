import { Button } from "@serea/ui/button";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@serea/ui/accordion";
import { SocialLoginIcons } from "~/lib/constants";
import { auth } from "@serea/auth";
import { redirect } from "next/navigation";
import EmailOtp from "./email-otp";

type Socials = "discord" | "google" | "twitter";

const socials: { id: Socials; icon: React.ReactNode; label: string }[] = [
	{
		id: "discord",
		icon: SocialLoginIcons.Discord,
		label: "Discord",
	},
	{
		id: "google",
		icon: SocialLoginIcons.Google,
		label: "Google",
	},
];

export default function LoginActions() {
	return (
		<>
			<form className="space-y-2">
				{socials.slice(0, 2).map((social) => (
					<Button
						key={social.id}
						formAction={async () => {
							"use server";
							const res = await auth.api.signInSocial({
								body: {
									provider: social.id,
									callbackURL: "/",
								},
							});
							redirect(res.url);
						}}
						variant="outline"
						className="w-full"
					>
						<div className="w-full items-center flex space-x-1">
							{social.icon}
							<p>Continue with {social.label}</p>
						</div>
					</Button>
				))}
			</form>
			<Accordion type="single" collapsible>
				<AccordionItem
					className="border-b-0 border-t-[1px] mt-4"
					value="more-options"
				>
					<AccordionTrigger className="text-center flex justify-center h-8 items-center">
						<p className="text-xs">More options</p>
					</AccordionTrigger>
					<AccordionContent className="space-y-2">
						<EmailOtp />
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</>
	);
}
