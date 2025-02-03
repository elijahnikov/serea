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

import { Input } from "@serea/ui/input";
import { Textarea } from "@serea/ui/textarea";
import { z } from "zod";
import { UploadButton } from "~/lib/utils/uploadthing";

import { Card } from "@serea/ui/card";
import { Label } from "@serea/ui/label";
import { UploadIcon, UserIcon } from "lucide-react";
import * as React from "react";

const onboardingSchema = z.object({
	image: z.string().optional(),
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
						<UploadButton
							onClientUploadComplete={(e) => {
								form.setValue("image", e[0]?.url);
							}}
							endpoint="imageUploader"
							content={{
								button({ ready, isUploading, uploadProgress }) {
									if (isUploading) {
										return (
											<div className="flex items-center space-x-1">
												{/* <LoadingSpinner size={12} /> */}
												<p className="text-neutral-500">
													Uploading... {uploadProgress}%
												</p>
											</div>
										);
									}
									if (ready)
										return (
											<div className="p-2">
												{(user.user.image ?? imageWatch) ? (
													<img
														src={imageWatch ?? user.user.image ?? ""}
														alt="User avatar"
														className="w-24 h-24 rounded-full"
													/>
												) : (
													<div className="h-24 w-24 flex ring-1 ring-inset ring-secondary justify-center items-center border shadow-sm-dark rounded-full">
														<UserIcon className="w-8 h-8 text-secondary-foreground" />
													</div>
												)}
											</div>
										);
								},
							}}
							appearance={{
								container:
									"ring-0 w-full flex items-left border-none focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none",
								button: "min-h-max bg-transparent mr-auto max-w-max",
								allowedContent: "hidden",
							}}
						/>
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
										placeholder="Enter your bio"
										label="Bio"
										helperText="Tell other users a bit about yourself."
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
