import type { RouterOutputs } from "@serea/api";
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
import { toast } from "sonner";
import type { z } from "zod";
import { createWatchlist } from "@serea/validators";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { api } from "~/trpc/react";
import { LoadingButton } from "@serea/ui/loading-button";
import useDebounce from "~/hooks/use-debounce";
import { useRouter } from "next/navigation";

const editSchema = createWatchlist.omit({ entries: true });

export default function EditForm({
	watchlist,
	setOpen,
}: {
	watchlist: Pick<
		RouterOutputs["watchlist"]["get"],
		"id" | "title" | "description" | "tags" | "isPrivate" | "hideStats"
	>;
	setOpen: (open: boolean) => void;
}) {
	const close = useDebounce(() => setOpen(false), 500);
	const router = useRouter();
	const trpcUtils = api.useUtils();

	const update = api.watchlist.update.useMutation({
		onSuccess: () => {
			trpcUtils.watchlist.get.invalidate({ id: watchlist.id });
			close();
			router.refresh();
		},
	});

	const form = useForm<z.infer<typeof editSchema>>({
		resolver: zodResolver(editSchema),
		defaultValues: {
			...watchlist,
			description: watchlist.description ?? "",
			tags: watchlist.tags !== "" ? watchlist.tags?.split(",") : [],
			private: watchlist.isPrivate,
		},
	});

	const handleSubmit = (data: z.infer<typeof editSchema>) => {
		update.mutate({ ...data, id: watchlist.id });
	};

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

	return (
		<>
			<div className="flex flex-col mb-2 gap-4">
				<h1 className="text-xl font-medium">Edit</h1>
			</div>
			<Form {...form}>
				<form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel description="Required" required>
									Title
								</FormLabel>
								<FormControl>
									<Input autoFocus={false} {...field} />
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
					<div className="flex justify-end w-full">
						<LoadingButton
							loading={update.isPending}
							type="submit"
							spinnerSize="xs"
							variant={"secondary"}
							className="w-full"
						>
							Save
						</LoadingButton>
					</div>
				</form>
			</Form>
		</>
	);
}
