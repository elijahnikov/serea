import { zodResolver } from "@hookform/resolvers/zod";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@serea/ui/form";
import { LoadingButton } from "@serea/ui/loading-button";
import Textarea from "@serea/ui/textarea";
import { Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { api } from "~/trpc/react";
const createCommentSchema = z.object({
	content: z.string().min(1, { message: "Please enter text here to comment." }),
});

export default function CommentForm({ watchlistId }: { watchlistId: string }) {
	const createComment = api.comments.create.useMutation({
		onSuccess: () => {
			form.reset({ content: "" });
			toast.success("You have successfully commented on this watchlist.");
		},
	});

	const form = useForm<z.infer<typeof createCommentSchema>>({
		resolver: zodResolver(createCommentSchema),
		defaultValues: {
			content: "",
		},
	});

	const handleSubmit = (data: z.infer<typeof createCommentSchema>) => {
		createComment.mutate({
			watchlistId,
			...data,
		});
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea placeholder="Write your comment here..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<LoadingButton
					type="submit"
					size="md"
					variant="outline"
					className="mt-2 w-full"
					loading={createComment.isPending}
					spinnerSize="xs"
					after={<Send className="text-neutral-100 size-4" />}
				>
					Submit
				</LoadingButton>
			</form>
		</Form>
	);
}
