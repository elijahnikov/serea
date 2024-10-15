import { watchlistInviteSchema } from "@serea/validators";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { Form, FormControl, FormField, FormItem } from "@serea/ui/form";
import Input from "@serea/ui/input";
import { Plus } from "lucide-react";
import { LoadingButton } from "@serea/ui/loading-button";

export default function InviteForm({ watchlistId }: { watchlistId: string }) {
	const form = useForm<z.infer<typeof watchlistInviteSchema>>({
		resolver: zodResolver(watchlistInviteSchema),
		defaultValues: {
			email: "",
			role: "viewer",
		},
	});

	const trpcUtils = api.useUtils();
	const invite = api.members.invite.useMutation({
		onSuccess: () => {
			trpcUtils.members.listInvites.invalidate({ watchlistId });
		},
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) => {
					invite.mutate({
						inviteeEmail: data.email,
						role: data.role,
						watchlistId,
					});
				})}
			>
				<div className="w-full items-center space-x-2 flex">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="w-full relative">
								<FormControl>
									<Input {...field} placeholder="Add people by email" />
								</FormControl>
							</FormItem>
						)}
					/>

					<LoadingButton
						loading={invite.isPending}
						className="h-10"
						size={"sm"}
						type="submit"
						before={<Plus size={16} />}
						spinnerSize="xs"
						variant="outline"
					>
						Invite
					</LoadingButton>
				</div>
			</form>
		</Form>
	);
}
