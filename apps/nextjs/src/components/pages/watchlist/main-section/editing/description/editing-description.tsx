import { zodResolver } from "@hookform/resolvers/zod";
import type { RouterOutputs } from "@serea/api";
import { cn } from "@serea/ui/cn";
import { Form, FormControl, FormField, FormItem } from "@serea/ui/form";
import Loading from "@serea/ui/loading";
import Textarea from "@serea/ui/textarea";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useKeyPress from "~/hooks/use-key-press";
import { api } from "~/trpc/react";

const updateDescriptionSchema = z.object({
	description: z.string().optional(),
});

export const EditingDescription = ({
	watchlist,
	setIsEditing,
}: {
	watchlist: Pick<RouterOutputs["watchlist"]["get"], "description" | "id">;
	setIsEditing: (isEditing: boolean) => void;
}) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const formRef = useRef<HTMLDivElement>(null);

	const trpcUtils = api.useUtils();
	const updateDescription = api.watchlist.updateDescription.useMutation({
		onSuccess: () => {
			toast.success("Description has been updated.");
			void trpcUtils.watchlist.get.invalidate();
			setIsEditing(false);
		},
	});

	const form = useForm<z.infer<typeof updateDescriptionSchema>>({
		resolver: zodResolver(updateDescriptionSchema),
		defaultValues: {
			description: watchlist.description ?? "",
		},
	});
	const descriptionValue = form.watch("description");

	const handleClickOutside = (event: MouseEvent) => {
		if (formRef.current && !formRef.current.contains(event.target as Node)) {
			if (watchlist.description !== descriptionValue)
				void form.handleSubmit(onSubmit)();
			else setIsEditing(false);
		}
	};

	const escapeKeyCallback = () => {
		if (watchlist.description !== descriptionValue)
			void form.handleSubmit(onSubmit)();
		else setIsEditing(false);
	};
	useKeyPress("Escape", escapeKeyCallback);

	const onSubmit = (values: z.infer<typeof updateDescriptionSchema>) => {
		updateDescription.mutate({
			id: watchlist.id,
			description: values.description ?? null,
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [onSubmit]);

	return (
		<div
			ref={formRef}
			className="-ml-[4px] w-full flex items-center relative space-x-1"
		>
			<Form {...form}>
				<form
					className={cn(
						updateDescription.isPending && "opacity-50",
						"flex items-center space-x-1 w-full",
					)}
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem className="relative w-full">
								<FormControl>
									<div>
										<Textarea
											autoFocus
											placeholder={descriptionValue}
											className="text-md mt-3 mb-4 h-[200px] text-neutral-500 dark:text-neutral-400 flex w-full box-border border px-1 py-1 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
											{...field}
										/>
										<textarea
											{...field}
											className="absolute hidden"
											ref={inputRef}
										/>
									</div>
								</FormControl>
							</FormItem>
						)}
					/>
				</form>
			</Form>
			{updateDescription.isPending && (
				<div className="absolute inset-0 flex items-center justify-center">
					<Loading type="spinner" color="secondary" size="sm" />
				</div>
			)}
		</div>
	);
};
