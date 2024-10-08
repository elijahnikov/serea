"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Input from "@serea/ui/input";
import Textarea from "@serea/ui/textarea";
import { Button } from "@serea/ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "@serea/ui/form";
import { ChevronLeft } from "lucide-react";
import { movieTableSchema } from "@serea/validators";
import MovieList from "./movie-list";
import Switch from "@serea/ui/switch";
import ShareAccess from "./share-access";

export const watchlistCreateSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string().optional(),
	tags: z.string(),
	entries: movieTableSchema.array(),
	private: z.boolean().optional(),
	sharedWith: z.array(
		z.object({
			email: z.string().email(),
			accessLevel: z.enum(["read", "write"]).default("read"),
		}),
	),
});

export default function CreateForm() {
	const form = useForm<z.infer<typeof watchlistCreateSchema>>({
		resolver: zodResolver(watchlistCreateSchema),
		defaultValues: {
			title: "",
			description: "",
			entries: [],
			tags: "",
		},
	});

	function onSubmit(values: z.infer<typeof watchlistCreateSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	return (
		<div className="w-[1000px] pt-8">
			<p className="font-semibold tracking-tight text-neutral-800 text-xl">
				Create a watchlist
			</p>
			<p className="font-medium text-neutral-500 mb-8 text-md max-w-[75%]">
				Create your personalized movie watchlist and share it with friends.
			</p>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
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
											Add relevant comma separated keywords to categorize your
											watchlist.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
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
						</div>
						<MovieList form={form} />
					</div>
					<div className="flex justify-end mt-4 w-full space-x-1">
						<Button variant={"outline"} type="reset">
							<div className="flex items-center space-x-1">
								<ChevronLeft size={16} />
								<p>Back</p>
							</div>
						</Button>
						<Button type="submit">Submit</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
