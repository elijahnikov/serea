import { watchlistInviteSchema } from "../../../../../../../packages/schemas/src";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@serea/ui/form";
import { Plus } from "lucide-react";
import { LoadingButton } from "@serea/ui/loading-button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
} from "@serea/ui/select";
import { inviteMemberAction } from "~/actions/members/invite";
import { useAction } from "next-safe-action/hooks";

export default function InviteForm({ watchlistId }: { watchlistId: string }) {
	const form = useForm<z.infer<typeof watchlistInviteSchema>>({
		resolver: zodResolver(watchlistInviteSchema),
		defaultValues: {
			email: "",
			role: "viewer",
		},
	});

	const invite = useAction(inviteMemberAction);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((data) => {
					invite.execute({
						inviteeEmail: data.email,
						role: data.role,
						watchlistId,
					});
				})}
			>
				<div className="w-full items-center space-x-2 flex">
					<div className="flex min-w-[300px] text-surface-900 border-surface-200 shadow-wg-xs items-center gap-2 border rounded-lg py-1 pl-2 pr-1">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="w-full relative">
									<FormControl>
										<input
											className="w-full bg-transparent focus:outline-none focus:ring-0 flex grow text-sm leading-6 transition-colors duration-100 placeholder:text-surface-500"
											{...field}
											placeholder="Add people by email"
										/>
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
											<SelectTrigger className="h-8 rounded-lg" />
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
					</div>

					<LoadingButton
						loading={invite.isPending}
						className="h-10"
						size={"sm"}
						type="submit"
						before={<Plus size={16} />}
						spinnerSize="xs"
						variant={"primary"}
					>
						Invite
					</LoadingButton>
				</div>
			</form>
		</Form>
	);
}
