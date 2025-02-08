import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@serea/ui/form";
import { Input } from "@serea/ui/input";
import { Label } from "@serea/ui/label";
import { LoadingButton } from "@serea/ui/loading-button";
import { Switch } from "@serea/ui/switch";
import { Textarea } from "@serea/ui/textarea";
import {
	type CreateWatchlistSchema,
	createWatchlistSchema,
} from "@serea/validators";
import { ArrowLeftIcon, CheckIcon, X } from "lucide-react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import MovieList from "./movie-list";
export default function CreateWatchlist({
	goBack,
}: {
	goBack: () => void;
}) {
	const form = useForm<CreateWatchlistSchema>({
		resolver: zodResolver(createWatchlistSchema),
		defaultValues: {
			title: "",
			description: "",
			tags: [],
			entries: [],
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
				// toast.error("Maximum 10 tags allowed")
				input.value = "";
				return;
			}

			if (currentTags.includes(value)) {
				// toast.error("Tag already exists, please use a unique tag.");
				input.value = "";
				return;
			}

			if (value.length > 20) {
				// toast.error("Tag must be 20 characters or less");
				input.value = "";
				return;
			}

			form.setValue("tags", [...currentTags, value]);
			input.value = "";
		}
	};

	const onSubmit = (data: z.infer<typeof createWatchlistSchema>) => {
		console.log(data);
	};

	React.useEffect(() => {
		if (isPrivate) {
			form.setValue("hideStats", false);
		}
	}, [isPrivate, form]);

	return (
		<div className="p-4 flex flex-col mb-4 sm:mb-0 justify-between gap-0 md:gap-4">
			<div className="flex flex-col">
				<p className="font-semibold tracking-tight dark:text-neutral-300 text-neutral-800 text-xl">
					Create a watchlist
				</p>
				<p className="font-medium text-neutral-500 mb-2 text-md">
					Create your personalized movie watchlist and share it with friends.
				</p>
			</div>
			<div>
				<Form {...form}>
					<form className="flex gap-4" onSubmit={form.handleSubmit(onSubmit)}>
						<div className="flex flex-col gap-4 max-w-md">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel description="Required" required>
											Title
										</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter a title for your watchlist"
												{...field}
											/>
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
											<Textarea className="max-h-[100px]" {...field} />
										</FormControl>
										<FormDescription>
											Give your new watchlist an appropriate description.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="tags"
								render={() => (
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
															<X size={14} className="text-carbon-900" />
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
								)}
							/>
							<Controller
								control={form.control}
								name="private"
								render={({ field: { onChange, ref, value, ...rest } }) => (
									<div className="flex items-center gap-2">
										<Switch
											{...rest}
											ref={ref}
											id="make-list-private"
											checked={value}
											onCheckedChange={onChange}
										/>
										<Label
											htmlFor="make-list-private"
											description="When public, anyone with the link can view your list. When private, only you and other members	 have access."
										>
											Make list private?
										</Label>
									</div>
								)}
							/>
							<Controller
								control={form.control}
								name="hideStats"
								render={({ field: { onChange, ref, value, ...rest } }) => (
									<div className="flex items-center gap-2">
										<Switch
											{...rest}
											id="hide-progress"
											ref={ref}
											checked={value}
											onCheckedChange={onChange}
											disabled={isPrivate}
											className={cn(isPrivate ? "cursor-not-allowed" : "")}
										/>
										<Label
											htmlFor="hide-progress"
											description="You can choose to hide progress stats from other users that are not part of your watchlist."
										>
											Hide progress?
										</Label>
									</div>
								)}
							/>
						</div>
						<div>
							<MovieList form={form} />
						</div>
					</form>
				</Form>
				<div className="flex w-full mt-4 gap-2 items-center">
					<Button
						variant={"secondary"}
						before={<ArrowLeftIcon />}
						className="mt-auto self-end max-w-[100px]"
						onClick={() => {
							form.reset({
								title: "",
								description: "",
								tags: [],
								entries: [],
								private: false,
							});
							goBack();
						}}
					>
						Back
					</Button>
					<LoadingButton className="w-full" after={<CheckIcon />}>
						Submit
					</LoadingButton>
				</div>
			</div>
		</div>
	);
}
