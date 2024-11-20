"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import { createWatchlist } from "@serea/validators";
import { toast } from "sonner";
import { useEffect } from "react";
import { Button } from "@serea/ui/button";
import { RefreshCcw, X } from "lucide-react";
import { LoadingButton } from "@serea/ui/loading-button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@serea/ui/form";
import Input from "@serea/ui/input";
import Textarea from "@serea/ui/textarea";
import Badge from "@serea/ui/badge";
import Label from "@serea/ui/label";
import Switch from "@serea/ui/switch";
import { cn } from "@serea/ui/cn";
import MovieList from "./movie-list";
import { api } from "~/trpc/react";

export default function CreateForm() {
	const { mutate: create, isPending } = api.watchlist.create.useMutation({
		onSuccess: (data) => {
			router.push(`/watchlist/${data}`);
		},
	});

	const router = useRouter();
	const form = useForm<z.infer<typeof createWatchlist>>({
		resolver: zodResolver(createWatchlist),
		defaultValues: {
			title: "",
			description: "",
			entries: [],
			tags: [],
			private: false,
			hideStats: false,
		},
	});

	const isPrivate = form.watch("private");

	const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const input = e.currentTarget;
		const value = input.value.trim();

		if (e.key === "Enter" && value) {
			e.preventDefault();

			const currentTags = form.getValues("tags");
			if (currentTags.length >= 10) {
				toast.error("Maximum 10 tags allowed");
				return;
			}

			if (currentTags.includes(value)) {
				toast.error("Tag already exists, please use a unique tag.");
				return;
			}

			if (value.length > 20) {
				toast.error("Tag must be 20 characters or less");
				return;
			}

			form.setValue("tags", [...currentTags, value]);
			input.value = "";
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isPrivate) {
			form.setValue("hideStats", false);
		}
	}, [isPrivate]);

	return (
		<div className="w-full max-w-[1000px] px-4 py-8">
			<div className="flex flex-col mb-4 sm:mb-0 sm:flex-row justify-between gap-0 md:gap-4">
				<div className="flex flex-col">
					<p className="font-semibold tracking-tight dark:text-neutral-300 text-neutral-800 text-xl">
						Create a watchlist
					</p>
					<p className="font-medium text-neutral-500 mb-4 sm:mb-8 text-md">
						Create your personalized movie watchlist and share it with friends.
					</p>
				</div>
				<div className="flex justify-start sm:justify-end space-x-1">
					<Button
						variant={"outline"}
						className="max-h-10"
						onClick={() =>
							form.reset({
								title: "",
								description: "",
								entries: [],
								tags: [],
								private: false,
								hideStats: false,
							})
						}
						form="create-watchlist-form"
						type="reset"
						before={<RefreshCcw className="h-4 w-4" />}
					>
						Reset
					</Button>
					<LoadingButton
						form="create-watchlist-form"
						className="max-h-10"
						spinnerSize="xs"
						loading={isPending}
						type="submit"
					>
						Create
					</LoadingButton>
				</div>
			</div>
			<Form {...form}>
				<form
					id="create-watchlist-form"
					onSubmit={form.handleSubmit((data) => {
						create(data);
					})}
				>
					<div className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
						<div className="w-full space-y-6">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel description="Required" required>
											Title
										</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel description="Optional">Description</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormDescription>
											Give your new watchlist an appropriate description.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div>
								<FormItem>
									<FormLabel description="Optional">Tags</FormLabel>
									<Input onKeyDown={handleTagInput} />
									<div className="mt-2 flex flex-wrap gap-2">
										{form.watch("tags").map((tag, index) => (
											<Badge
												key={`${tag}_${
													// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
													index
												}`}
												stroke
												className="cursor-pointer"
												onClick={() => {
													const currentTags = form.getValues("tags");
													form.setValue(
														"tags",
														currentTags.filter((_, i) => i !== index),
													);
												}}
											>
												<div className="flex items-center gap-1">
													<p>{tag}</p>
													<X size={14} className="text-neutral-500" />
												</div>
											</Badge>
										))}
									</div>
									<FormDescription>
										Press enter to add a new tag. Max 10 tags.
									</FormDescription>
									<FormMessage />
								</FormItem>
							</div>
							<Label>Privacy</Label>
							<Controller
								control={form.control}
								name="private"
								render={({ field: { onChange, ref, value, ...rest } }) => (
									<Switch
										{...rest}
										ref={ref}
										checked={value}
										onCheckedChange={onChange}
										alignLabel="end"
										disabled={false}
										helperText="When public, anyone with the link can view your list. When private, only you and other members	 have access."
										label="Make list private?"
										tooltip="Tooltip example"
									/>
								)}
							/>
							<Controller
								control={form.control}
								name="hideStats"
								render={({ field: { onChange, ref, value, ...rest } }) => (
									<Switch
										{...rest}
										ref={ref}
										checked={value}
										onCheckedChange={onChange}
										alignLabel="end"
										disabled={isPrivate}
										className={cn(isPrivate ? "cursor-not-allowed" : "")}
										helperText="You can choose to hide progress stats from other users that are not part of your watchlist."
										label="Hide progress?"
										tooltip="Tooltip example"
									/>
								)}
							/>
						</div>
						<div className="w-full lg:w-[700px]">
							<MovieList form={form} />
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
}
