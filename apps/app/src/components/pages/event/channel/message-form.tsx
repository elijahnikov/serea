import {
	Form,
	FormControl,
	FormField,
	FormItem,
	useForm,
} from "@serea/ui/form";
import { Input } from "@serea/ui/input";
import { Label } from "@serea/ui/label";
import { Textarea } from "@serea/ui/textarea";
import { CornerDownLeftIcon } from "lucide-react";
import * as React from "react";
import { z } from "zod";
import { useThrottledIsTypingMutation } from "~/lib/hooks/channel";
import { api } from "~/trpc/react";

const formSchema = z.object({
	message: z.string().min(1),
});

export default function MessageForm({
	channelId,
	onPostCallback,
}: { channelId: string; onPostCallback: () => void }) {
	const addMessage = api.message.add.useMutation({
		onSuccess: () => {
			form.reset({
				message: "",
			});
			onPostCallback();
		},
	});
	const [isFocused, setIsFocused] = React.useState(false);

	const form = useForm({
		schema: formSchema,
		defaultValues: {
			message: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		if (data.message === "") {
			return;
		}

		addMessage.mutate({
			channelId,
			content: data.message,
		});
	});

	const isTypingMutation = useThrottledIsTypingMutation(channelId);
	const message = form.watch("message");

	React.useEffect(() => {
		isTypingMutation(isFocused && message.trim().length > 0);
	}, [isFocused, message, isTypingMutation]);

	return (
		<div className="border-t pb-6 px-4 pt-4">
			<Form {...form}>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit();
					}}
					className="w-full flex flex-col gap-2"
				>
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Textarea
										{...field}
										onKeyDown={(e) => {
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												onSubmit();
											}
										}}
										onFocus={() => setIsFocused(true)}
										onBlur={() => setIsFocused(false)}
										placeholder="Enter a message"
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
					</div>
				</form>
			</Form>
		</div>
	);
}
