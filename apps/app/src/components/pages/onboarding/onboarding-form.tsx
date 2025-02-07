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
import { LoadingButton } from "@serea/ui/loading-button";
import { Spinner } from "@serea/ui/spinner";

import { Input } from "@serea/ui/input";
import { Textarea } from "@serea/ui/textarea";
import { z } from "zod";
import { useUploadThing } from "~/lib/utils/uploadthing";

import { Badge } from "@serea/ui/badge";
import { cn } from "@serea/ui/cn";
import { Label } from "@serea/ui/label";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CheckIcon,
	GlobeIcon,
	UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { SOCIAL_LINKS_ICONS, genres } from "~/lib/constants";
import useDebounce from "~/lib/hooks/use-debounce";
import { api } from "~/trpc/react";

const onboardingSchema = z.object({
	image: z.string().optional(),
	username: z
		.string()
		.min(2, { message: "Username must be at least 2 characters" })
		.max(20, {
			message: "Username must be less than 20 characters",
		}),
	bio: z
		.string()
		.min(0)
		.max(200, { message: "Bio must be less than 200 characters" })
		.optional(),
	website: z.string().optional(),
	instagram: z.string().optional(),
	tiktok: z.string().optional(),
	twitter: z.string().optional(),
	genres: z.array(z.string()),
});

type OnboardingFormProps = {
	user: Session;
};
export default function OnboardingForm({ user }: OnboardingFormProps) {
	const router = useRouter();

	const [formStep, setFormStep] = React.useState<"about" | "recommendations">(
		"about",
	);

	const form = useForm({
		schema: onboardingSchema,
		defaultValues: {
			username: user.user.name ?? "",
			image: user.user.image ?? "",
			genres: [],
		},
	});

	const imageWatch = form.watch("image");
	const usernameWatch = form.watch("username");
	const bioWatch = form.watch("bio");
	const genresWatch = form.watch("genres");

	const debouncedUsername = useDebounce(usernameWatch, 500) as string;
	const checkUsername = api.user.checkUsername.useQuery(
		{
			username: debouncedUsername,
		},
		{
			enabled:
				Boolean(debouncedUsername) &&
				debouncedUsername !== "" &&
				debouncedUsername !== user.user.name,
		},
	);

	const onboard = api.user.onboard.useMutation({
		onSuccess: () => {
			router.refresh();
		},
	});

	const upload = useUploadThing("imageUploader", {
		onClientUploadComplete: (e) => {
			form.setValue("image", e[0]?.url);
		},
	});

	const onSubmit = (data: z.infer<typeof onboardingSchema>) => {
		onboard.mutate({
			...data,
			name: data.username,
			image: data.image,
			bio: data.bio,
			genres: data.genres,
		});
	};

	const handleGenreSelect = (genre: string) => {
		if (genresWatch.includes(genre)) {
			form.setValue(
				"genres",
				genresWatch.filter((g) => g !== genre),
			);
		} else if (genresWatch.length < 10) {
			form.setValue("genres", [...genresWatch, genre]);
		}
	};

	React.useEffect(() => {
		if (checkUsername.data?.exists) {
			form.setError("username", {
				message: "Username already exists",
			});
		} else {
			form.clearErrors("username");
		}
	}, [checkUsername.data, form]);

	React.useEffect(() => {
		if (bioWatch && bioWatch.length > 200) {
			form.setError("bio", {
				message: "Bio must be less than 200 characters",
			});
		} else {
			form.clearErrors("bio");
		}
	}, [bioWatch, form]);

	return (
		<div className="flex flex-col gap-4 mt-4 h-full w-full">
			<Form {...form}>
				<form
					className="gap-4 flex flex-col h-full"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					{formStep === "about" && (
						<>
							<div className="flex flex-col gap-2 items-left">
								<Label>Avatar</Label>
								<div className="relative w-full items-center gap-2 flex">
									<div>
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
											<div className="w-12 p-[2px] h-12 bg-white rounded-full flex items-center justify-center border">
												<Spinner size="sm" />
											</div>
										) : (
											<div>
												{(user.user.image ?? imageWatch) ? (
													<img
														src={imageWatch ?? user.user.image ?? ""}
														alt="User avatar"
														className="w-12 h-12 rounded-full object-cover"
													/>
												) : (
													<div className="h-12 w-12 flex ring-1 ring-inset ring-secondary justify-center items-center border shadow-sm-dark rounded-full hover:bg-secondary/5 transition-colors">
														<UserIcon className="w-6 h-6 text-secondary-foreground" />
													</div>
												)}
											</div>
										)}
									</div>
									<div>
										<h1 className="text-xs text-blue-500 font-medium">
											Upload new profile photo
										</h1>
										<p className="text-xs text-muted-foreground">
											Recommended size: 400x400px
										</p>
									</div>
								</div>
							</div>
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="relative">
												<Input
													{...field}
													onChange={(e) => {
														field.onChange(
															e.target.value.replace(/[^a-zA-Z0-9]/g, ""),
														);
													}}
													placeholder="Enter your name"
													label="Username"
													required
													className="pe-6"
													helperText={
														<span className="flex items-center text-muted-foreground font-medium">
															app.serea.co/
															<p
																className={cn(
																	!checkUsername.data?.exists
																		? "text-green-600"
																		: "text-black",
																)}
															>
																{usernameWatch}
															</p>
														</span>
													}
												/>
												{checkUsername.isLoading && usernameWatch !== "" && (
													<div className="absolute top-1/2 end-0 right-2 -mt-1">
														<Spinner className="fill-black" size="sm" />
													</div>
												)}
											</div>
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
												label="Brief Bio"
												helperText={
													<span
														className={cn(
															`${200 - (bioWatch ?? "").length < 0 ? "text-red-500" : "text-green-500"}`,
														)}
													>
														{200 - (bioWatch?.length ?? 0)}
													</span>
												}
												className="max-h-[50px]"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="flex flex-col gap-2">
								<div className="flex flex-col">
									<Label>Social Links</Label>
									<span className="text-xs text-muted-foreground">
										Add your social links to help people find you
									</span>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<FormField
										control={form.control}
										name="website"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														prefix={
															<div className="text-xs flex text-muted-foreground gap-1">
																<div className="[&_svg]:size-4">
																	<GlobeIcon />
																</div>
																https://
															</div>
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="instagram"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														prefix={
															<div className="text-xs flex text-muted-foreground gap-1">
																<div className="[&_svg]:size-4">
																	{SOCIAL_LINKS_ICONS.INSTAGRAM}
																</div>
																instagram.com/
															</div>
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="tiktok"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														prefix={
															<div className="text-xs flex text-muted-foreground gap-1">
																<div className="[&_svg]:size-4">
																	{SOCIAL_LINKS_ICONS.TIKTOK}
																</div>
																tiktok.com/@
															</div>
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="twitter"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Input
														prefix={
															<div className="text-xs flex text-muted-foreground gap-1">
																<div className="[&_svg]:size-4">
																	{SOCIAL_LINKS_ICONS.TWITTER}
																</div>
																x.com/
															</div>
														}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
							</div>
						</>
					)}
					{formStep === "recommendations" && (
						<div className="flex flex-col mt-2 h-full gap-2 items-left">
							<div>
								<div className="flex flex-col">
									<p className="text-xs text-muted-foreground">Optional</p>
									<Label
										description="Maximum 10 genres. Serea will use this information
									to show you recommendations based on your interests."
									>
										Select your favorite genres
									</Label>
								</div>
							</div>
							<div className="flex flex-wrap mt-2 gap-2">
								{genres.map((genre) => (
									<Badge
										color={genresWatch.includes(genre) ? "green" : "primary"}
										onClick={() => handleGenreSelect(genre)}
										key={genre}
										className="cursor-pointer"
										before={
											genresWatch.includes(genre) ? (
												<CheckIcon className="size-4" />
											) : undefined
										}
									>
										{genre}
									</Badge>
								))}
							</div>
						</div>
					)}
				</form>
				{formStep === "about" && (
					<Button
						after={<ArrowRightIcon />}
						className="mt-auto self-end w-full"
						onClick={() => setFormStep("recommendations")}
					>
						Continue
					</Button>
				)}
				{formStep === "recommendations" && (
					<div className="flex w-full  gap-2 items-center">
						<Button
							variant={"outline"}
							before={<ArrowLeftIcon />}
							className="mt-auto self-end max-w-[100px]"
							onClick={() => setFormStep("about")}
						>
							Back
						</Button>
						<LoadingButton
							loading={onboard.isPending}
							className="w-full"
							after={<CheckIcon />}
							onClick={form.handleSubmit(onSubmit)}
						>
							Complete
						</LoadingButton>
					</div>
				)}
			</Form>
		</div>
	);
}
