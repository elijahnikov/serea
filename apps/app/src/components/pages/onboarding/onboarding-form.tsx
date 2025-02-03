"use client";

import type { Session } from "@serea/auth";
import { Button } from "@serea/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	useForm,
} from "@serea/ui/form";
import { Spinner } from "@serea/ui/spinner";

import { Input } from "@serea/ui/input";
import { Textarea } from "@serea/ui/textarea";
import { z } from "zod";
import { UploadButton, useUploadThing } from "~/lib/utils/uploadthing";

import { Label } from "@serea/ui/label";
import { CircleIcon, PersonStanding, UploadIcon, UserIcon } from "lucide-react";
import * as React from "react";

const onboardingSchema = z.object({
	image: z.string().optional(),
	username: z.string().min(2).max(20),
	bio: z.string().min(0).max(100).optional(),
});

type OnboardingFormProps = {
	user: Session;
};
export default function OnboardingForm({ user }: OnboardingFormProps) {
	const form = useForm({
		schema: onboardingSchema,
		defaultValues: {
			username: user.user.name ?? "",
			image: user.user.image ?? "",
		},
	});

	const upload = useUploadThing("imageUploader", {
		onClientUploadComplete: (e) => {
			form.setValue("image", e[0]?.url);
		},
	});

	const imageWatch = form.watch("image");

	return (
		<div className="flex flex-col gap-4 mt-4 h-full">
			<Form {...form}>
				<form
					className="gap-4 flex flex-col h-full"
					onSubmit={form.handleSubmit((data) => {
						console.log(data);
					})}
				>
					<div className="flex flex-col gap-2 items-left">
						<Label>Avatar</Label>
						<div className="relative w-24">
							<input
								type="file"
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
								onChange={async (e) => {
									const file = e.target.files?.[0];
									if (!file) return;
									await upload.startUpload([file]);
								}}
								accept="image/*"
							/>
							{upload.isUploading ? (
								<div className="w-24 p-[2px] h-24 bg-white rounded-full flex items-center justify-center border">
									<Spinner size="sm" />
								</div>
							) : (
								<div className="p-[2px]">
									{(user.user.image ?? imageWatch) ? (
										<img
											src={imageWatch ?? user.user.image ?? ""}
											alt="User avatar"
											className="w-24 h-24 rounded-full object-cover"
										/>
									) : (
										<div className="h-24 w-24 flex ring-1 ring-inset ring-secondary justify-center items-center border shadow-sm-dark rounded-full hover:bg-secondary/5 transition-colors">
											<UserIcon className="w-8 h-8 text-secondary-foreground" />
										</div>
									)}
								</div>
							)}
						</div>
						<span className="text-xs text-muted-foreground">
							Upload an image that represents you best.
						</span>
					</div>
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
										optional
										placeholder="Enter your bio"
										label="Biography"
										helperText="Tell other users a bit about yourself. Max 200 characters."
										className="max-h-[50px]"
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
