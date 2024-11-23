import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@serea/ui/form";
import Input from "@serea/ui/input";
import { LoadingButton } from "@serea/ui/loading-button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from "@serea/ui/select";
import { Plus } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "~/trpc/react";

const inviteSchema = z.object({
	email: z.string().email(),
	role: z.enum(["viewer", "editor"]),
});

export default function InviteForm({ watchlistId }: { watchlistId: string }) {
	const trpcUtils = api.useUtils();
	const invite = api.members.invite.useMutation({
		onSuccess: () => {
			void trpcUtils.members.listInvites.invalidate({ watchlistId });
			form.reset();
		},
	});
	const form = useForm<z.infer<typeof inviteSchema>>({
		resolver: zodResolver(inviteSchema),
		defaultValues: {
			email: "",
			role: "viewer",
		},
	});

	const handleSubmit = (data: z.infer<typeof inviteSchema>) => {
		invite.mutate({ watchlistId, ...data });
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<div className="flex gap-2 items-center">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} placeholder="Enter an email address" />
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger className="rounded-lg" />
										<SelectContent>
											<SelectGroup>
												<SelectItem value="viewer">View</SelectItem>
												<SelectItem value="editor">Edit</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
							</FormItem>
						)}
					/>
					<LoadingButton
						loading={invite.isPending}
						type="submit"
						spinnerSize="xs"
						variant={"secondary"}
					>
						Send
					</LoadingButton>
				</div>
			</form>
		</Form>
	);
}
