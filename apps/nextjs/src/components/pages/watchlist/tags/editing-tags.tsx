import { zodResolver } from "@hookform/resolvers/zod";
import type { RouterOutputs } from "@serea/api";
import Badge from "@serea/ui/badge";
import { cn } from "@serea/ui/cn";
import { Form, FormControl, FormField, FormItem } from "@serea/ui/form";
import Input from "@serea/ui/input";
import Loading from "@serea/ui/loading";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useKeyPress from "~/hooks/use-key-press";
import { api } from "~/trpc/react";

const updateTagsSchema = z.object({
	tags: z.string().array(),
});

export default function EditingTags({
	watchlist,
	setIsEditing,
}: {
	watchlist: Pick<RouterOutputs["watchlist"]["get"], "tags" | "id">;
	setIsEditing: (editing: boolean) => void;
}) {
	const [loading, setLoading] = useState<boolean>(false);
	const formRef = useRef<HTMLDivElement>(null);

	const trpcUtils = api.useUtils();
	const updateTags = api.watchlist.updateTags.useMutation({
		onSuccess: () => {
			toast.success("Tags have been updated.");
			void trpcUtils.watchlist.get.invalidate();
			setIsEditing(false);
		},
	});

	const form = useForm<z.infer<typeof updateTagsSchema>>({
		resolver: zodResolver(updateTagsSchema),
		defaultValues: {
			tags: watchlist.tags ? watchlist.tags.split(",") : [],
		},
	});
	const tagsValue = form.watch("tags");

	const handleClickOutside = (event: MouseEvent) => {
		if (formRef.current && !formRef.current.contains(event.target as Node)) {
			if (watchlist.tags !== tagsValue.join(","))
				void form.handleSubmit(onSubmit)();
			else setIsEditing(false);
		}
	};

	const escapeKeyCallback = () => {
		if (watchlist.tags !== tagsValue.join(","))
			void form.handleSubmit(onSubmit)();
		else setIsEditing(false);
	};
	useKeyPress("Escape", escapeKeyCallback);

	const onSubmit = (data: z.infer<typeof updateTagsSchema>) => {
		updateTags.mutate({
			id: watchlist.id,
			tags: data.tags,
		});
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onSubmit]);

	return (
		<div ref={formRef} className="flex flex-col items-center gap-2">
			<div className="flex items-center gap-2">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											onKeyDown={handleTagInput}
											placeholder="Add tags..."
											className={cn(!updateTags.isPending && "-ml-6")}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
					</form>
				</Form>
				{updateTags.isPending && (
					<Loading type="spinner" color="secondary" size="xs" />
				)}
			</div>
			<div className="flex flex-wrap gap-2">
				{tagsValue.length > 0 &&
					tagsValue.map((tag, index) => (
						<Badge
							onClick={() => {
								const currentTags = form.getValues("tags");
								form.setValue(
									"tags",
									currentTags.filter((_, i) => i !== index),
								);
							}}
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							stroke
							className="text-sm text-secondary-500 cursor-pointer"
						>
							<div className="flex items-center gap-1">
								<p>{tag}</p>
								<X size={14} className="text-neutral-500" />
							</div>
						</Badge>
					))}
			</div>
		</div>
	);
}
