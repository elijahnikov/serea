import { zodResolver } from "@hookform/resolvers/zod";
import type { RouterOutputs } from "@serea/api";
import { Form, FormControl, FormField, FormItem } from "@serea/ui/form";
import Input from "@serea/ui/input";
import Loading from "@serea/ui/loading";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useKeyPress from "~/hooks/use-key-press";
import { api } from "~/trpc/react";

const updateTitleSchema = z.object({
	title: z.string().min(1, { message: "Please enter a title." }),
});

export default function EditingTitle({
	watchlist,
	setIsEditing,
}: {
	watchlist: Pick<RouterOutputs["watchlist"]["get"], "title" | "id">;
	setIsEditing: (isEditing: boolean) => void;
}) {
	const inputRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<HTMLDivElement>(null);

	const trpcUtils = api.useUtils();
	const updateTitle = api.watchlist.updateTitle.useMutation({
		onSuccess: () => {
			toast.success("Title has been updated.");
			void trpcUtils.watchlist.get.invalidate();
			setIsEditing(false);
		},
	});

	const form = useForm<z.infer<typeof updateTitleSchema>>({
		resolver: zodResolver(updateTitleSchema),
		defaultValues: {
			title: watchlist.title,
		},
	});
	const titleValue = form.watch("title");

	const handleClickOutside = (event: MouseEvent) => {
		if (formRef.current && !formRef.current.contains(event.target as Node)) {
			if (watchlist.title !== titleValue) void form.handleSubmit(onSubmit)();
			else setIsEditing(false);
		}
	};

	const escapeKeyCallback = () => {
		if (watchlist.title !== titleValue) void form.handleSubmit(onSubmit)();
		else setIsEditing(false);
	};
	useKeyPress("Escape", escapeKeyCallback);

	const onSubmit = (values: z.infer<typeof updateTitleSchema>) => {
		updateTitle.mutate({
			id: watchlist.id,
			title: values.title,
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
		<div ref={formRef} className="-ml-[4px] w-3/4 flex items-center space-x-1">
			<Form {...form}>
				<form
					className="flex items-center space-x-1 w-full"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem className="relative w-full">
								<FormControl>
									<div>
										<Input
											autoFocus
											placeholder={titleValue}
											className="text-3xl flex h-[36px] w-full box-border border px-1 py-1 font-semibold transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
											{...field}
										/>
										<input
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
			{updateTitle.isPending && (
				<Loading type="spinner" color="secondary" size="xs" />
			)}
		</div>
	);
}
