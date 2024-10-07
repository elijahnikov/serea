"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { ChevronLeft, Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import Label from "@serea/ui/label";
import { movieTableSchema, type MovieTableSchemaType } from "@serea/validators";
import MovieSearch from "./movie-search";
import { useState } from "react";
import Image from "next/image";
import { TMDB_IMAGE_BASE_URL_SD } from "~/lib/constants";

const formSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string().optional(),
	tags: z.string(),
	entries: movieTableSchema.array(),
});

export default function CreateForm() {
	const [open, setOpen] = useState<boolean>(false);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			entries: [],
			tags: "",
		},
	});
	const entries = form.watch("entries");

	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		console.log(values);
	}

	const addEntry = (newEntry: MovieTableSchemaType) => {
		const entries = form.getValues("entries");
		if (
			entries.findIndex(
				(entry) =>
					entry.contentId === newEntry.contentId &&
					entry.title === newEntry.title,
			) === -1
		) {
			const currentEntries = form.getValues("entries");
			form.setValue("entries", [...currentEntries, { ...newEntry }]);
		}
	};

	const removeEntry = (indexToRemove: number) => {
		const currentEntries = form.getValues("entries");
		const updatedEntries = currentEntries.filter(
			(_, index) => index !== indexToRemove,
		);
		form.setValue("entries", updatedEntries);
	};

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
						<div className="w-full space-y-4">
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
						</div>
						<div className="w-full">
							<div className="w-full">
								<div>
									<Label className="mb-2">Movies</Label>
									<div className="bg-surface-50 border border-dashed shadow-wg-xs flex flex-col items-center px-4 w-full max-h-[500px] min-h-[500px] rounded-lg">
										<Popover open={open} onOpenChange={setOpen}>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="bg-white mt-4"
													size="sm"
													before={<Plus size={14} />}
												>
													Add movie
												</Button>
											</PopoverTrigger>

											<PopoverContent className="min-w-[400px]">
												<MovieSearch callback={(movie) => addEntry(movie)} />
											</PopoverContent>
										</Popover>
										<div className="space-y-2 pb-4 mt-4 max-h-[500px] overflow-y-auto w-full">
											{entries?.length > 0 &&
												entries.map((entry, index) => (
													<MovieCard
														index={index}
														removeEntry={removeEntry}
														movie={entry}
														key={entry.contentId}
													/>
												))}
										</div>
									</div>
								</div>
							</div>
						</div>
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

function MovieCard({
	movie,
	index,
	removeEntry,
}: {
	movie: MovieTableSchemaType;
	index: number;
	removeEntry: (index: number) => void;
}) {
	return (
		<div className="flex space-x-2 relative bg-white p-1 w-full rounded-lg border">
			<div>
				{movie.poster ? (
					<Image
						className="aspect-auto rounded-md"
						src={`${TMDB_IMAGE_BASE_URL_SD}${movie.poster}`}
						alt={`Poster for ${movie.title}`}
						width={40}
						height={80}
					/>
				) : (
					<div className="w-full min-h-[110px] flex-col max-w-[70px] text-center h-full justify-center flex items-center">
						<p className="text-wrap text-xs font-medium text-neutral-600">
							{movie.title}
						</p>
						<p className="text-wrap text-xs font-medium text-neutral-400">
							{new Date(movie.releaseDate).getFullYear()}
						</p>
					</div>
				)}
			</div>
			<div>
				<p className="font-medium truncate text-sm max-w-[300px]">
					{movie.title}
				</p>
				<p className="font-medium text-sm text-neutral-500">
					{new Date(movie.releaseDate).getFullYear()}
				</p>
			</div>
			<Button
				onClick={() => removeEntry(index)}
				className="absolute top-1 right-1 h-6 w-6"
				size={"xs-icon"}
				variant={"outline"}
			>
				<X size={14} className="text-neutral-500" />
			</Button>
		</div>
	);
}
