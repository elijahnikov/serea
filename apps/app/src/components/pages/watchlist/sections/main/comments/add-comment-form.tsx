import { Button } from "@serea/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	useForm,
} from "@serea/ui/form";
import { Label } from "@serea/ui/label";
import { LoadingButton } from "@serea/ui/loading-button";
import { Textarea } from "@serea/ui/textarea";
import { CornerDownLeftIcon, SendIcon } from "lucide-react";
import { z } from "zod";
import { api } from "~/trpc/react";

const createCommentSchema = z.object({
	content: z.string().min(1, {
		message: "Comment is required",
	}),
});

export default function AddCommentForm({
	watchlistId,
}: {
	watchlistId: string;
}) {
	const utils = api.useUtils();
	const comment = api.watchlist.createComment.useMutation({
		onSuccess: () => {
			utils.watchlist.getComments.invalidate();
		},
	});

	const form = useForm({
		schema: createCommentSchema,
		defaultValues: {
			content: "",
		},
	});

	const onSubmit = (data: z.infer<typeof createCommentSchema>) => {
		comment.mutate({
			watchlistId,
			content: data.content,
		});
		form.reset({
			content: "",
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex mt-4 flex-col gap-2"
			>
				<FormField
					control={form.control}
					name="content"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Textarea
									className="h-24 resize-none"
									placeholder="Add a comment"
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											form.handleSubmit(onSubmit)();
										}
									}}
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<div className="flex ml-auto gap-2 items-center">
					<Label className="text-xs text-carbon-900">
						Press{" "}
						<span className="font-mono flex gap-1 text-white">
							Enter <CornerDownLeftIcon className="h-3.5 w-3.5" />
						</span>{" "}
						to submit
					</Label>
					<LoadingButton
						before={<SendIcon />}
						className="min-w-36"
						loading={comment.isPending}
						type="submit"
					>
						Submit
					</LoadingButton>
				</div>
			</form>
		</Form>
	);
}
