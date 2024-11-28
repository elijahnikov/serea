import { zodResolver } from "@hookform/resolvers/zod";
import { Popover } from "@lemonsqueezy/wedges";
import { Button } from "@serea/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@serea/ui/form";
import Input from "@serea/ui/input";
import { LoadingButton } from "@serea/ui/loading-button";
import { PopoverContent, PopoverTrigger } from "@serea/ui/popover";
import { CopyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/trpc/react";

const cloneSchema = z.object({
	title: z.string().min(1, { message: "Title is required" }),
});

export default function CloneButton({
	watchlistTitle,
	watchlistId,
}: {
	watchlistTitle: string;
	watchlistId: string;
}) {
	const [open, setOpen] = useState(false);

	const router = useRouter();
	const clone = api.watchlist.clone.useMutation({
		onSuccess: (data) => {
			toast.success("Watchlist cloned successfully, redirecting...");
			router.push(`/watchlist/${data}`);
		},
	});

	const form = useForm<z.infer<typeof cloneSchema>>({
		resolver: zodResolver(cloneSchema),
		defaultValues: {
			title: `${watchlistTitle} (Copy)`,
		},
	});

	const handleSubmit = (data: z.infer<typeof cloneSchema>) => {
		clone.mutate({
			title: data.title,
			id: watchlistId,
		});
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!open) {
			form.reset({
				title: `${watchlistTitle} (Copy)`,
			});
		}
	}, [open]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button className="h-8" size={"xs-icon"} variant={"tertiary"}>
					<CopyIcon size={18} />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="min-w-[500px]">
				<div>
					<Form {...form}>
						<form
							className="flex flex-col gap-2"
							onSubmit={form.handleSubmit(handleSubmit)}
						>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-1">
								<LoadingButton
									loading={clone.isPending}
									spinnerSize="xs"
									variant={"tertiary"}
								>
									Copy
								</LoadingButton>
							</div>
						</form>
					</Form>
				</div>
			</PopoverContent>
		</Popover>
	);
}
