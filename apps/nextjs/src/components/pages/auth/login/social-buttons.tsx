import { signIn } from "@serea/auth";
import { Button } from "@serea/ui/button";
import { SocialLoginIcons } from "~/lib/constants";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@serea/ui/accordion";

const socials = [
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
	{
		id: "twitter",
		icon: SocialLoginIcons.X,
		label: "X",
	},
	{
		id: "apple",
		icon: SocialLoginIcons.Apple,
		label: "Apple",
	},
];

export default function SocialButtons() {
	return (
		<form className="space-y-2">
			{socials.slice(0, 2).map((social) => (
				<Button
					key={social.id}
					formAction={async () => {
						"use server";
						await signIn(social.id, { redirectTo: "/" });
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
			<Accordion type="single" collapsible>
				<AccordionItem
					className="border-b-0 border-t-[1px] mt-4"
					value="more-options"
				>
					<AccordionTrigger className="text-center flex justify-center h-8 items-center">
						<p className="text-xs">More options</p>
					</AccordionTrigger>
					<AccordionContent className="space-y-2">
						{socials.slice(2, socials.length).map((social) => (
							<Button
								key={social.id}
								formAction={async () => {
									"use server";
									await signIn(social.id, { redirectTo: "/" });
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
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</form>
	);
}
