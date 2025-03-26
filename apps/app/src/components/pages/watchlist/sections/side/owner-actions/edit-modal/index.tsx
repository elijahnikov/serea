import type { RouterOutputs } from "@serea/api";
import { Badge } from "@serea/ui/badge";
import { Button } from "@serea/ui/button";
import { cn } from "@serea/ui/cn";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@serea/ui/dialog";
import { DropdownMenuItem } from "@serea/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	useForm,
} from "@serea/ui/form";
import { Input } from "@serea/ui/input";
import { Label } from "@serea/ui/label";
import { LoadingButton } from "@serea/ui/loading-button";
import { Switch } from "@serea/ui/switch";
import { Textarea } from "@serea/ui/textarea";
import { sleep } from "@trpc/server/unstable-core-do-not-import";
import { PencilIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const editWatchlistSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	tags: z.string().array(),
	isPrivate: z.boolean().optional(),
	hideStats: z.boolean().optional(),
});

export default function EditModal({
	watchlist,
}: { watchlist: RouterOutputs["watchlist"]["get"] }) {
	const [isOpen, setIsOpen] = React.useState(false);

	const router = useRouter();
	const utils = api.useUtils();
	const editWatchlist = api.watchlist.editWatchlist.useMutation({
		onSuccess: async () => {
			void utils.watchlist.get.invalidate();
			setIsOpen(false);
		},
	});
	const form = useForm({
		schema: editWatchlistSchema,
		defaultValues: {
			title: watchlist.title,
			description: watchlist.description ?? undefined,
			tags: watchlist.tags ?? [],
			isPrivate: watchlist.isPrivate,
			hideStats: watchlist.hideStats,
		},
	});

	const onSubmit = (data: z.infer<typeof editWatchlistSchema>) => {
		editWatchlist.mutate({
			watchlistId: watchlist.id,
			...data,
		});
	};

	const isPrivate = form.watch("isPrivate");

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

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
					<PencilIcon />
					<span>Edit watchlist</span>
				</DropdownMenuItem>
			</DialogTrigger>
			<DialogContent className="min-w-[600px]">
				<DialogHeader>
					<DialogTitle>Edit watchlist</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col w-full">
					<div>
						<Form {...form}>
							<form
								className="flex gap-4 w-full"
								onSubmit={form.handleSubmit(onSubmit)}
							>
								<div className="flex flex-col gap-6">
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
												<FormLabel description="Optional">
													Description
												</FormLabel>
												<FormControl>
													<Textarea className="max-h-[100px]" {...field} />
												</FormControl>
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
																key={`${tag}_${index}`}
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
																	<X size={14} />
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
										name="isPrivate"
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
							</form>
						</Form>
						<div className="flex w-full mt-8 gap-2 items-center">
							<LoadingButton
								onClick={form.handleSubmit(onSubmit)}
								className="w-full"
								loading={editWatchlist.isPending}
							>
								Update
							</LoadingButton>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
