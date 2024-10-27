"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import Input from "@serea/ui/input";
import Textarea from "@serea/ui/textarea";
import { LoadingButton } from "@serea/ui/loading-button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@serea/ui/form";
import { watchlistCreateSchema } from "@serea/validators";
import MovieList from "./movie-list";
import Switch from "@serea/ui/switch";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@serea/ui";
import { useEffect } from "react";
import Label from "@serea/ui/label";
import Badge from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import { RefreshCcw } from "lucide-react";

export default function CreateForm() {
	const router = useRouter();
	const form = useForm<z.infer<typeof watchlistCreateSchema>>({
		resolver: zodResolver(watchlistCreateSchema),
		defaultValues: {
			title: "",
			description: "",
			entries: [],
			tags: "",
			private: false,
			hideStats: false,
		},
	});

	const createWatchlist = api.watchlist.create.useMutation({
		onSuccess: async (id) => {
			toast.success("Your watchlist has been created! Redirecting...");
			form.reset();
			router.push(`/watchlist/${id}`);
		},
	});

	const isPrivate = form.watch("private");

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (isPrivate) {
			form.setValue("hideStats", false);
		}
	}, [isPrivate]);

	return (
		<div className="w-[1000px] pt-8">
			<div className="flex justify-between">
				<div className="flex min-w-[800px] flex-col">
					<p className="font-semibold tracking-tight text-neutral-800 text-xl">
						Create a watchlist
					</p>
					<p className="font-medium text-neutral-500 mb-8 text-md max-w-[75%]">
						Create your personalized movie watchlist and share it with friends.
					</p>
				</div>
				<div className="flex justify-end w-full max-h-10 space-x-1">
					<Button
						variant={"outline"}
						size={"sm"}
						onClick={() =>
							form.reset({
								title: "",
								description: "",
								entries: [],
								tags: "",
								private: false,
								hideStats: false,
							})
						}
						type="reset"
						before={<RefreshCcw size={16} />}
					>
						Reset
					</Button>
					<LoadingButton
						className="max-h-10"
						spinnerSize="xs"
						loading={createWatchlist.isPending}
						type="submit"
					>
						Create
					</LoadingButton>
				</div>
			</div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((data) => {
						createWatchlist.mutate(data);
					})}
				>
					<div className="flex space-x-8">
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
								<FormField
									control={form.control}
									name="tags"
									render={({ field }) => (
										<FormItem>
											<FormLabel description="Optional">Tags</FormLabel>
											<FormControl>
												<Input {...field} />
											</FormControl>
											<FormDescription>
												Press enter to add a new tag. Max 10 tags.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
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
										helperText="When public, anyone with the link can view your list. When private, only you have access."
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
										className={cn(isPrivate && "cursor-not-allowed")}
										helperText="You can choose to hide progress stats from other users that are not part of your watchlist."
										label="Hide progress?"
										tooltip="Tooltip example"
									/>
								)}
							/>
						</div>
						<MovieList form={form} />
					</div>
				</form>
			</Form>
		</div>
	);
}
