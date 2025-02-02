"use client";

import { type Session, signOut } from "@serea/auth";
import { Button } from "@serea/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	useForm,
} from "@serea/ui/form";

import { Input } from "@serea/ui/input";
import { Textarea } from "@serea/ui/textarea";
import { z } from "zod";
import { api } from "~/trpc/react";

const onboardingSchema = z.object({
	username: z.string().min(2).max(20),
	bio: z.string().min(0).max(100),
});

type OnboardingFormProps = {
	user: Session;
};
export default function OnboardingForm({ user }: OnboardingFormProps) {
	const form = useForm({
		schema: onboardingSchema,
		defaultValues: {
			username: user.user.name ?? "",
			bio: "",
		},
	});

	return (
		<div className="flex flex-col gap-4 mt-8 h-full">
			<Form {...form}>
				<form
					className="gap-4 flex flex-col h-full"
					onSubmit={form.handleSubmit((data) => {
						console.log(data);
					})}
				>
					<img
						src={user.user.image ?? ""}
						alt="User avatar"
						className="w-12 h-12 rounded-full"
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input
										{...field}
										placeholder="Enter your name"
										label="Username"
										required
										helperText="This will be your username shown to other users throughout Serea."
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="bio"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										{...field}
										placeholder="Enter your bio"
										label="Bio"
										helperText="Tell other users about yourself."
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button className="mt-auto self-end w-full">Continue</Button>
				</form>
			</Form>
		</div>
	);
}
